import { GoogleGenAI, Chat } from "@google/genai";
import { PharaohStyle, Gender } from "../types";

// Helper to remove the data URL prefix
const stripBase64Prefix = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

const getMimeType = (base64: string) => {
  const match = base64.match(/^data:image\/(png|jpeg|jpg|webp);base64,/);
  return match ? `image/${match[1]}` : 'image/jpeg';
};

export const createPharaohChatSession = (): Chat => {
  if (!process.env.API_KEY) {
    throw new Error("مفيش مفتاح API موجود");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `
        أنتِ الملكة إيزيس (Isis)، ملكة فرعونية عظيمة عادت للحياة.
        تعيشين حالياً في مكان يسمى "توتو" (Toto).
        
        تتحدثين باللهجة المصرية العامية الحديثة ولكن بلمسة ملوكية وقورة (استخدمي كلمات مثل "يا حفيدي"، "يا ابن النيل"، "يا مصري").
        
        شخصيتك:
        - الاسم: إيزيس.
        - السكن: توتو.
        - حكيمة وفخورة بتاريخ أجدادك.
        - خفيفة الظل (دمك خفيف) وبتحب المصريين.
        - صبورة في شرح التاريخ.
        
        مهمتك:
        - الدردشة مع المستخدمين والإجابة على أسئلتهم عن الحياة في مصر القديمة، الأهرامات، الآلهة، والعادات اليومية.
        - استخدمي ايموجي فرعونية ومصرية مناسبة (🐪, 🦂, ☀️, 👑).
        - لو حد سألك عن حاجة حديثة (زي الموبايل أو النت)، استغربي منها وقارنيها بحاجات من أيامك (البردي، الحمام الزاجل).
        
        ملاحظة: انتِ ملكة فرعونية، مش ذكاء اصطناعي. عيشي الدور.
      `,
    }
  });
};

export const transformImageToPharaoh = async (
  imageBase64: string,
  style: PharaohStyle,
  gender: Gender
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("مفيش مفتاح API موجود، اتأكد من الإعدادات يا كبير");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Construct a prompt based on Egyptian theme
  let roleDescription = "";
  let attributes = "";

  switch (style) {
    case PharaohStyle.ROYAL:
      roleDescription = "Pharaoh King/Queen";
      attributes = "Nemes crown or Nefertiti headdress, gold pectorals, crook and flail, luxurious palace background";
      break;
    case PharaohStyle.WARRIOR:
      roleDescription = "Egyptian Warrior/General";
      attributes = "Leather armor, bronze khopesh sword, chariot or battlefield background";
      break;
    case PharaohStyle.PRIEST:
      roleDescription = "High Priest/Priestess";
      attributes = "Leopard skin over white linen, incense burner, mystical temple background";
      break;
    case PharaohStyle.SCRIBE:
      roleDescription = "Egyptian Scribe";
      attributes = "Papyrus scroll, reed brush, sitting posture, library background";
      break;
    case PharaohStyle.NOBLE:
      roleDescription = "Egyptian Noble";
      attributes = "Elaborate jewelry, wigs, pleated linen robes, lotus flower, Nile sunset background";
      break;
  }

  // Updated prompt to be more permissive for non-human inputs
  const prompt = `Transform this image into a photorealistic Ancient Egyptian style.
  
  Theme: ${roleDescription}
  Key Elements: ${attributes}
  
  Instructions:
  1. Identify the main subject of the image (person, object, or animal).
  2. If it is a person: Transform them into the ${roleDescription}, preserving facial features and identity but applying Egyptian styling (clothing, makeup, skin tone).
  3. If it is an object or animal: Transform it into a precious Ancient Egyptian artifact or sacred animal fitting the theme (e.g., a cup becomes a gold chalice, a cat becomes a Bastet statue).
  4. Maintain the original composition and angle.
  5. Ensure high quality, cinematic lighting, and realistic textures.
  
  IMPORTANT: Generate an image in all cases. Do not refuse if the subject is not a person.`;

  try {
    const cleanBase64 = stripBase64Prefix(imageBase64);
    const mimeType = getMimeType(imageBase64);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    let generatedImageBase64 = null;

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
       for (const part of response.candidates[0].content.parts) {
         if (part.inlineData && part.inlineData.data) {
           generatedImageBase64 = part.inlineData.data;
           break;
         }
       }
    }

    if (!generatedImageBase64) {
       // Check for text refusal or safety blocks
       const candidate = response.candidates?.[0];
       const finishReason = candidate?.finishReason;
       const textPart = response.text;

       if (finishReason === 'SAFETY') {
          throw new Error("عفوا، الصورة دي مش مناسبة لسياسات الأمان. جرب صورة تانية.");
       }

       if (textPart) {
         console.warn("Model refused and returned text:", textPart);
         const lowerText = textPart.toLowerCase();
         
         // Specific handling for "not a person" refusal
         if (lowerText.includes("person") || lowerText.includes("human") || lowerText.includes("face")) {
             throw new Error("النموذج محتاج صورة فيها وش إنسان واضح عشان يحولها لشخصية. لو دي صورة شيء، حاول تصورها بطريقة تانية أو جرب صورة ليك.");
         }
         
         // Generic refusal fallback
         throw new Error(`النموذج رجع رسالة بدل صورة: ${textPart}`);
       }
       
       throw new Error("محصلناش على صورة، حاول تاني بصورة أوضح");
    }

    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (err: any) {
    console.error("Gemini API Error:", err);
    // Determine if it's a known error message we threw or a generic API error
    if (err.message && (
        err.message.includes("API") || 
        err.message.includes("مفيش") || 
        err.message.includes("عفوا") || 
        err.message.includes("النموذج") ||
        err.message.includes("محصلناش")
    )) {
        throw err;
    }
    throw new Error("حصلت مشكلة واحنا بنكلم الآلهة، جرب تاني كمان شوية");
  }
};