const { generateFakeUsers } = require("./user.faker");
const { generateFakeTips } = require("./tip.faker");
const { generateFakeTags } = require("./tag.faker");
const { generateFakeTagTip } = require("./tagtip.faker");
const { generateFakeCommentaires } = require("./commentaire.faker");
const { makeFakeInformations } = require("./information.faker");

/**
 * Genere la base de données
 */
fakeMain = async () => {
    // genere des utilisateurs
    const users = await generateFakeUsers();
    const tags = await generateFakeTags();
    const tips = await generateFakeTips(users);
    const info = await makeFakeInformations(tips);
    // creation des TagTip
    const tagstip = await generateFakeTagTip(tags, tips);
    const commentaires = await generateFakeCommentaires(users, tips);
}

(async () => {
    fakeMain();
  })();