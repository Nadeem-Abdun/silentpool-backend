import crypto from "crypto";

const poolNames = [
    "Atlantis", "Asgard", "Metropolis", "Gotham", "Wakanda", "Themyscira", "Krypton", "Xandar", "Titan", 
    "Knowhere", "Sakaar", "Latveria", "Genosha", "StarCity", "CentralCity", "Midgard", "Oa", "Apokolips", 
    "Pandora", "Cybertron", "Vulcan", "Coruscant", "Tatooine", "Mustafar", "Hoth", "Dagobah", "Endor", 
    "Beskar", "DeathStar", "HelmDeep", "Mordor", "Rivendell", "Valhalla", "Olympus", "Camelot", "Zion", 
    "NebulaPrime", "EchoChamber", "NeoTokyo", "OmicronPersei8", "Skaro", "Trantor", "Terminus", "Arrakis", 
    "Dune", "Hyperion", "Erewhon", "NewAsgard", "Sanctuary", "Elysium"
];

export function poolNamesGenerator() {
    const name = poolNames[Math.floor(Math.random() * poolNames.length)];
    // Generate a short random suffix (4 hex characters = 2 bytes)
    const suffix = crypto.randomBytes(2).toString("hex");
    return `${name}_${suffix}`;
}
