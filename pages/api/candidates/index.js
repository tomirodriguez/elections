// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const candidates = require("../../../api-elecciones/utils/candidatesParser");
const token = require("../../../api-elecciones/utils/getToken");
const ApiFetcher = require("../../../api-elecciones/utils/axios").ApiFetcher;

export default async function handler(
  req,
  res
) {
  // Chequear si esta en base de datos. Si no esta, pedirlo
  const tokenResponse = await token.getToken();
  const fetcher = new ApiFetcher(tokenResponse);
  const candidatesByCategory = await candidates.getCandidatesByCategeory(
    fetcher
  );
  // Guardar en base de datos

  res.status(200).json({
    error: false,
    message: "Data successfully fetched!",
    response: {
      candidates: candidatesByCategory,
    },
  });
}
