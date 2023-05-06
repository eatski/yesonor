import { readFileSync } from "fs"
import { resolve } from "path"
import {describe,test,expect} from "vitest"
import { parseYaml } from "./parseYaml" 

const sampleYaml = readFileSync(resolve(process.cwd(),"samples","sample1.yaml"), "utf-8")

describe('parseYaml', () => {
    test("should parse input yaml", ()=> {
        expect(parseYaml(sampleYaml)).toMatchSnapshot()
    })
})