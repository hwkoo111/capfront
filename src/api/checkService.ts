// 예시: src/api/checkService.ts
import api from "./index";

export const pingServer = async (): Promise<string> => {
  const { data } = await api.get<string>("/test");
  return data;
};
