(async () => {
  // Get all modules
  webpackChunkdiscord_app.push([["meow"], {}, e => { mods = Object.values(e.c) }]);
  // Removed the pushed array, not really necessary
  webpackChunkdiscord_app.splice(webpackChunkdiscord_app.length - 1, 1)

  // CSV thingies
  let out = []
  let out_mappings = []

  // Discord's internal request module
  const requestModule = mods.find(e => e?.exports?.default?.getAPIBaseURL).exports.default;

  // Just a helper method to get relationships
  const getUser = async (id) => {
    return (await requestModule.get({ url: `/users/${id}/relationships`, oldFormErrors: !0 })).body;
  }

  // Get the current user's friends, type 1 is friend
  let selfRelationships = (await getUser("@me")).filter(rel => rel.type === 1);
  // Push to CSV data
  out.push(`@me,${selfRelationships.map(rel => rel.id).join()}`)

  // Loop through each friend
  for (const [index, friend] of selfRelationships.entries()) {
    console.log(`Fetching mutuals for ${friend.id} => ${friend.nickname || friend.user.username} (${index + 1} out of ${selfRelationships.length})`);
    // Ne need to filter, always returns type 1
    let friendMutuals = await getUser(friend.id);

    // Map the mutuals to their ids and names and avatars
    out.push(`${friend.id},${friendMutuals.map(rel => rel.id).join()}`);
    // Nickname support, if you were one of the few who actually
    // used it I wont question how you got friend nicknames to be enabled for you
    out_mappings.push(`${friend.id},${friend.nickname || friend.user.username},${friend.user.avatar}`);
  }

  console.log("Done, copy the following output and paste it in scraped.json")
  console.log(JSON.stringify({
    out: out.join("\n"),
    out_mappings: out_mappings.join("\n")
  }));
})();
