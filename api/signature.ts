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
