import { _storeData, _retrieveData } from "mkdm-rn-async-storage";

const interceptedRequest = async (
  subUrl: string,
  body: any,
  headers: any,
  method: string,
  auth?: boolean
) => {
  try {
    const config: any = {
      headers: headers || {},
      method: method || "GET",
      mode: "cors",
      body: JSON.stringify(body),
    };

    if (config.method !== "GET" && config.method !== "HEAD" && body) {
      config.body = JSON.stringify(body);
      config.headers["Content-Type"] =
        config.headers["Content-Type"] || "application/json";
    }

    const token = await _retrieveData("access_token");
    console.log(token);
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    let url: URL =
      auth === true
        ? new URL(process.env.REACT_AUTH_SERVER_URL + subUrl)
        : new URL(process.env.REACT_HTTP_SERVER_URL + subUrl);

    if (config.method === "GET" && body) {
      url.href += subUrl;

      Object.keys(body).forEach((key: string) =>
        url.searchParams.append(
          key,
          key === "filter" ? JSON.stringify(body[key]) : body[key]
        )
      );
      delete config["body"];
    }

    const response = await fetch(url.href, config);

    if (response.status === 401 && !config._retry) {
      config._retry = true;

      const refreshToken = await _retrieveData("refresh_token");

      const newTokenTry = await fetch(process.env.AUTH_SERVER_URL + "/token", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (newTokenTry.status === 401) {
        throw Error("session_ended");
      }

      if (newTokenTry.status === 201) {
        const newToken = await newTokenTry.json();
        await _storeData("access_token", newToken.newToken);
        config.headers["Authorization"] = "Bearer " + newToken.newToken;
        const retry = await fetch(url.href, config);
        const json = await retry.json();
        const status = retry.status;
        return { ...json, status };
      }
    }

    const json = await response.json();
    const status = response.status;

    return { ...json, status };
  } catch (error: any) {
    return { error: error.message };
  }
};

const get = async (body: any, headers: any, subUrl: string) => {
  try {
    return await interceptedRequest(subUrl, body, headers, "GET");
  } catch (error: any) {
    return { error: error.message };
  }
};

const post = async (body: object, headers: any | null, subUrl: string) => {
  try {
    return await interceptedRequest(subUrl, body, headers, "POST");
  } catch (error: any) {
    return { error: error.message };
  }
};

const put = async (body: object, headers: object | null, subUrl: string) => {
  try {
    return await interceptedRequest(subUrl, body, headers, "PUT");
  } catch (error: any) {
    return { error: error.message };
  }
};

const del = async (body: object, headers: object | null, subUrl: string) => {
  try {
    return await interceptedRequest(subUrl, body, headers, "DELETE");
  } catch (error: any) {
    return { error: error.message };
  }
};

export { get, post, put, del };
