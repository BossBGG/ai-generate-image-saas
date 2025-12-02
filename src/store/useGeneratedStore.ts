import { create } from 'zustand';
import { z } from "zod";
import { ImageGenerationFormSchema } from "@/components/image-generation/Configurations";
import { generateImageAction } from '@/app/actions/image-actions';
import { de } from 'zod/v4/locales';
interface GenerateState{
    loading: boolean,
    images: Array<{url: string}>,
    error: string | null,
    generateImage: (values: z.infer<typeof ImageGenerationFormSchema>) => Promise<void>
}

const useGeneratedStore = create<GenerateState>((set) => ({
  loading: false,
  images: [],
  error: null,
  
  generateImage: async (values: z.infer<typeof ImageGenerationFormSchema>) => {
    set({loading: true, error: null})

    try{
    const {error, success, data} = await generateImageAction(values);
    if(!success){
        set({error: error, loading: false})
        return
    }

    console.log(data);

    const dataWithUrl = data.map((url:string) => {
        return {
            url
        }
    })

    set({images: dataWithUrl, loading: false})
    } catch(error){
        console.error(error);
        set({error: "Failed to generate image. Please try again.", loading: false})
    }
  } 
}))

export default useGeneratedStore;