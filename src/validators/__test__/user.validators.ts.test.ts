import { parseUserId, parseUserInput } from "../user.validators";

describe("parseUserId", () => {
  test("有効な数値文字列を受け取ったら成功する", () => {
    const result = parseUserId("123");
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: 123 });
    expect(result.data).toMatchSnapshot();
  });

  test.each(["0", "-1", "abc", undefined, ""])("無効な入力(%s)は失敗する", (input) => {
    const result = parseUserId(input as any);
    expect(result.success).toBe(false);
    expect(result.data).toMatchSnapshot();
  });
});

describe("parseUserInput", () => {
  test("有効な文字列を受け取ったら成功する", () => {
    const result = parseUserInput({ name: "aaa" });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ name: "aaa" });
    expect(result.data).toMatchSnapshot();
  });

  test("有効な文字数(50文字以下)の文字列を受け取ったら成功する", () => {
    const result = parseUserInput({
      name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    });
    expect(result.data).toMatchSnapshot();
  });

  test.each([
    { input: { name: "" }, desc: "空文字列" },
    { input: { name: 123 as any }, desc: "数値" },
    { input: undefined, desc: "undefined" },
  ])("無効な入力(%s)は失敗する", ({ input }) => {
    const result = parseUserInput(input as any);
    expect(result.success).toBe(false);
    expect(result.data).toMatchSnapshot();
  });
});
