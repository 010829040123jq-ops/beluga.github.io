export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const { task, title, chapter, text, persona, roles } = req.body || {};

  if (!apiKey) {
    return res.status(200).json({
      fallback: true,
      result: localFallback({ task, title, chapter, text, persona })
    });
  }

  const systemPrompt = [
    "你是一个中文 AI 创意写作助手。",
    "你的目标是辅助作者，而不是替代作者。",
    "请保持语言自然，有故事感，避免明显 AI 腔。",
    "回答必须简洁、可直接使用。",
    "不要输出无关解释。"
  ].join("\n");

  const roleText = Array.isArray(roles)
    ? roles.map((r) => `${r.name}: ${r.desc}`).join("\n")
    : "";

  const userPrompt = buildPrompt({ task, title, chapter, text, persona, roleText });

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI API error."
      });
    }

    return res.status(200).json({ result: extractText(data) });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error." });
  }
}

function buildPrompt({ task, title, chapter, text, persona, roleText }) {
  const context = [
    `故事标题：${title || "未命名故事"}`,
    `当前章节：${chapter || "未指定"}`,
    roleText ? `角色设定：\n${roleText}` : "",
    `当前文本：\n${text || ""}`
  ].filter(Boolean).join("\n\n");

  const prompts = {
    generate: `请根据以下信息生成一个中文故事章节草稿，长度约 300-500 字。保留悬念和人物动机。\n\n${context}`,
    revise: `请优化以下中文故事文本，使表达更自然、节奏更顺，但不要改变核心情节。只输出优化后的正文。\n\n${context}`,
    expand: `请扩写以下文本，增加动作、环境和心理细节，但不要过度堆砌辞藻。只输出扩写后的正文。\n\n${context}`,
    shorten: `请压缩以下文本，保留核心情节和情绪，语言更凝练。只输出压缩后的正文。\n\n${context}`,
    continue: `请根据以下文本续写下一段，保持风格一致，制造一点新的悬念。只输出续写后的完整正文。\n\n${context}`,
    reader: `请以“${persona || "普通读者"}”的视角，对以下故事文本给出 3 条具体反馈。关注读者体验、叙事节奏、人物动机和逻辑连贯性。不要替作者重写正文。\n\n${context}`,
    mentor: `请作为写作导师，对以下故事文本给出 3-5 条可操作的修改建议。每条建议不超过 35 字。\n\n${context}`
  };

  return prompts[task] || prompts.generate;
}

function extractText(data) {
  if (typeof data.output_text === "string") return data.output_text;

  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") parts.push(content.text);
    }
  }
  return parts.join("\n").trim() || "未生成内容，请重试。";
}

function localFallback({ task, title, chapter, text, persona }) {
  const samples = {
    generate: `【${chapter || "章节"}】旧图书馆的灯忽然亮了。${title || "这个故事"}的秘密从一张招新传单开始，主角在半信半疑中走进三层走廊，却发现墙上的照片都在看着自己。`,
    revise: `${text || ""}\n\n【优化建议】可以进一步补充人物动机，并让关键转折前有一个更明显的情绪停顿。`,
    expand: `${text || ""}\n\n她没有立刻推门。门缝里透出的光像一条细线，把她和那个未知的社团连接在一起。`,
    shorten: `${text || ""}`.split(/[。！？\n]/).filter(Boolean).slice(0, 3).join("。") + "。",
    continue: `${text || ""}\n\n就在她准备离开时，走廊尽头传来一声极轻的钟响。`,
    reader: `${persona || "普通读者"}：这一段氛围不错，但人物动机还可以更明确。建议补充主角为什么愿意继续探索。`,
    mentor: `- 明确本章核心冲突。\n- 增加人物动作细节。\n- 保留 AI 的结构，但用自己的语言重写关键句。`
  };
  return samples[task] || "已生成内容。";
}
