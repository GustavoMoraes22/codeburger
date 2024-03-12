import jwt from "jsonwebtoken";
import authConfig from "../../config/auth";

export default (request, response, next) => {
  const authToken = request.headers.authorization;

  // verifica se o token esta sendo passado
  if (!authToken) {
    return response.status(401).json({ error: "Token not provided" });
  }

  // separa o Bearer do token
  const token = authToken.split(" ")[1];

  // validação do token
  try {
    jwt.verify(token, authConfig.secret, function (err, decoded) {
      if (err) {
        throw new Error();
      }

      request.userId = decoded.id;
      request.userName = decoded.name;
      return next();
    });
  } catch (error) {
    return response.status(401).json({ error: "Token is invalid" });
  }
};
