import { Signature } from "@/interface/signature";
import axiosInstance from "./axiosInstance";



export const getAllSignatures = async (): Promise<Signature[]> => {
  try {
    const response = await axiosInstance.get("/signature/all");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching signatures:", error);
    throw error;
  }
};

export const getSignatureDisplay = async (signature_path: string): Promise<string> => {
  try {
    const response = await axiosInstance.get("/signature/display", {
      params: { signature_path },
    });
    return response.data.data.signatureUrl;
  } catch (error) {
    console.error("Error fetching signature display URL:", error);
    throw error;
  }
};
