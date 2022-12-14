import jwt from "jsonwebtoken";

function loginRequired(req, res, next) {
  const userToken = req.headers["authorization"]?.split(" ")[1];
  if (!userToken || userToken === "null") {
    console.log("서비스 사용 요청이 있습니다.하지만, Authorization 토큰: 없음");
    res.status(403).json({
      result: "forbidden-approach",
      reason: "로그인한 유저만 사용할 수 있는 서비스입니다.",
    });

    return;
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    const jwtDecoded = jwt.verify(userToken, secretKey);

    const userId = jwtDecoded.userId;
    const isAdmin = jwtDecoded.isAdmin;

    req.currentUserId = userId;
    req.isAdmin = isAdmin;

    next();
  } catch (error) {
    // jwt.verify 함수가 에러를 발생시키는 경우는 토큰이 정상적으로 decode 안되었을 경우임.
    // 403 코드로 JSON 형태로 프론트에 전달함.
    res.status(403).json({
      result: "forbidden-approach",
      reason: "정상적인 토큰이 아닙니다.",
    });

    return;
  }
}

function adminRequired(req, res, next) {
  try {
    if (req.isAdmin) {
      next();
    } else {
      // throw new Error("관리자 유저만 사용할 수 있는 서비스입니다.");
      res.status(403).json({
        result: "forbidden-approach",
        reason: "관리자 유저만 사용할 수 있는 서비스입니다.",
      });
    }
  } catch (err) {
    next(err);
  }
}

export { loginRequired, adminRequired };
