import { NotFoundError } from "@/server/errors";
import { binary, errorResponse } from "@/server/http";
import { getFileStorage, isAvatarKey } from "@/server/storage";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string[] }> },
): Promise<Response> {
  try {
    const { key } = await context.params;
    const storageKey = `avatars/${key.join("/")}`;
    if (!isAvatarKey(storageKey)) {
      throw new NotFoundError("Avatar not found");
    }
    const stored = await getFileStorage().get(storageKey);
    if (stored === null) {
      throw new NotFoundError("Avatar not found");
    }
    return binary(stored.data, stored.contentType, {
      headers: { "cache-control": "public, max-age=86400, immutable" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
