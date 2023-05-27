import { Configuration, OpenAIApi } from "openai";
import Axios from "axios";
import { resolve } from "path";
import {  } from "../aciot/core";
import { applyTestHooks } from "../aciot/vitest";

export const setupOpenaiForTest = () => {
    const axios = Axios.create();
    applyTestHooks(axios, {
        mode: process.env.CI ? "always" : "ondemand",
        cacheBasePath: resolve(process.cwd(), ".resultSnapshots"),
    })
    return new OpenAIApi(
        new Configuration({
            apiKey: process.env.OPENAI_API_KEY
        }),
        undefined,
        axios
    );
}