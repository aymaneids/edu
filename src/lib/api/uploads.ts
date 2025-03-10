import { supabase } from "../supabase";

export async function uploadFile(
  file: File,
  bucket: string,
  folder: string = "",
) {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      data: {
        path: data.path,
        url: urlData.publicUrl,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { data: null, error };
  }
}
