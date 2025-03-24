import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function useContactForm() {
  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await axios.post("/api/contact", data);
      return response.data;
    },
  });

  return {
    submitForm: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
