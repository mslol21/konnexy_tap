import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";

const paramsSchema = z.object({
  businessId: z.string().uuid(),
  kind: z.enum(["logo", "cover"]),
});

const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
const maxSizeByKind = { logo: 2 * 1024 * 1024, cover: 4 * 1024 * 1024 } as const;

function extensionFor(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason === "unauthenticated" ? "Não autenticado." : "Acesso negado." }, { status: auth.status });
  }

  try {
    const form = await request.formData();
    const parsed = paramsSchema.safeParse({
      businessId: form.get("businessId"),
      kind: form.get("kind"),
    });
    const file = form.get("file");

    if (!parsed.success || !(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo ou cliente inválido." }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: "Formato inválido. Use PNG, JPG ou WEBP." }, { status: 400 });
    }

    if (file.size <= 0 || file.size > maxSizeByKind[parsed.data.kind]) {
      const mb = parsed.data.kind === "logo" ? 2 : 4;
      return NextResponse.json({ error: `Arquivo muito grande. Limite de ${mb} MB.` }, { status: 400 });
    }

    const service = createServiceClient();
    const { data: business, error: businessError } = await service
      .from("businesses")
      .select("id")
      .eq("id", parsed.data.businessId)
      .maybeSingle();

    if (businessError || !business) {
      return NextResponse.json({ error: "Cliente não encontrado." }, { status: 404 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = extensionFor(file);
    const folder = parsed.data.kind === "logo" ? "logos" : "covers";
    const path = `${folder}/${parsed.data.businessId}/${parsed.data.kind}-${Date.now()}.${ext}`;

    const { error: uploadError } = await service.storage
      .from("business-assets")
      .upload(path, bytes, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Falha no upload de imagem", uploadError.message);
      return NextResponse.json({ error: "Não foi possível enviar a imagem." }, { status: 500 });
    }

    const { data: publicData } = service.storage.from("business-assets").getPublicUrl(path);
    const url = publicData.publicUrl;

    const field = parsed.data.kind === "logo" ? "logo_url" : "cover_url";
    const { error: updateError } = await service
      .from("businesses")
      .update({ [field]: url })
      .eq("id", parsed.data.businessId);

    if (updateError) {
      await service.storage.from("business-assets").remove([path]);
      return NextResponse.json({ error: "Upload concluído, mas não foi possível vincular a imagem ao cliente." }, { status: 500 });
    }

    return NextResponse.json({ success: true, url, path, kind: parsed.data.kind });
  } catch (error) {
    console.error("Erro no upload de imagem", error);
    return NextResponse.json({ error: "Não foi possível processar o arquivo." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason === "unauthenticated" ? "Não autenticado." : "Acesso negado." }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const parsed = paramsSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Cliente inválido." }, { status: 400 });

    const service = createServiceClient();
    const field = parsed.data.kind === "logo" ? "logo_url" : "cover_url";
    const { error } = await service.from("businesses").update({ [field]: null }).eq("id", parsed.data.businessId);
    if (error) return NextResponse.json({ error: "Não foi possível remover a imagem." }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
}
