zrobić kolorki do embedów jak w discord.js

# (/) commands
teraz podczas rejestracji komendy do dc jest przesyłany jej json.
przez to dc automatycznie odpowiada na komendy (/) przez co nie można urzyć żadnej db ponieważ za odpowiedzi odpowiada discord a nie bot.
trzeda zmienić to tak: {
  1. jeżeli nie ma customowej odpowiedzi (interaction_execute) to dc ma sam odpowiadac na urzycie slash command
  2. jeżeli jest customowa odpowiedz to dc nie ma dopowidać, zamiast tego ma być wykonywany kod np: {
    const command = ???
    command.interaction_execute(interaction_data, senti)
  }
  podczas rejestracji / command z customową odp prawdopodobnie najlepszym rozwiązaniem będzie podawanie takiego jsona aby nie było żadnych odpowiedzi (same dane i opcje dla usera)
}

# teraz:
spróbować usunąć wiadomości duchy z logów (if !messge.content return)
zrobić voice

jak zrobić api limiter:
zrobić to nie asynchroniczne

# todo
+ error handler -> jeżeli zostanie włączony podczas tworzenia clienta bota to
nie ma wywalać bota tylko emitować error
1. spróbować zrobić wbudowany system db albo handler do jakiejś db online
2. rozwinąć komendy np "channel_delete" z test/commands na normalne komendy
3. zrobić system helpa do komend
4. przetestować wszystkie komendy
5. dodać opisy @param... do syfu typu: senti.INVITE_CREATE
6. usunąć usles logi
7. dodać opcję tts do wiadomości
8. dodać do readme ilość pobrań
9. przetestować deleteAllSlashCommands i deleteSlashCommand w main.js!

10. error system: client.on("error") , client.on("warring)
11. wysyłanie interakcji bez odpowiadania na oryginalną
12. odpowiadanie na wiadomość (zwykła wiadomość)
13. wywyłanie wiadomości na pv
14. do przetestowania wszystko z eventsHandler !! - tylko kilka jest przetestowane
15. tutoriale na yt jak zrobić bota
16. prosta dokumentacja w readme
18. sprawdzić czy to działa, jeżeli nie to zrobić funkcje żeby działało: message.mentions.members.first() || message.guild.members.cache.get(args[0])
19. dodać możliwość wywyłania kilku embedów w 1 wiadomości: (jeżeli przekazana zostanie lista(array) to embeds: [<input>] ma być zamienione na embeds: <input>)
20. system uprawnień: const { Permissions: { FLAGS } } = require('discord.js'); , message.member.permissions.has(FLAGS.ADMINISTRATOR) -- sprawdzić jak to aktualnie działa, ewentualnie zrobić coś od 0
21. system voice: @discordjs/voice❌
22. sytem dodawania pliku do wiadomości po jego lokalizacji na dysku: new Discord.MessageAttachment(`commands/komendy/game_flags/flags/${rng}.png`) \ może jeszcze dodawanie pliku po linku

# !! zrobic publiczną wersję senti_client na githubie
# !! i podlinkować w readme żeby na npm było widać,
# !! w npm dodać link do zgłaszania błędów
# !! zrobić jakąś opcję zgłąszania chęci współpracy

# kiedyś:
1. zamienić axiosa na featch żeby user nie musiał pobierać dodatkowych bibliotek
2. PROGRAM WSPIERAJĄCYCH -- załośyć zbiórkę np na partonite czy czymś żeby zbierać hajs na stworzenie strony interetowej, wsparcie twórcy, dalszy rozwój, jak kiedyś powstanie strona to dodawać tam listę osób które wspierają, wspierający np mogą dostawać dostęp do wersji Beta updatów (dostęp do wersji produkcyjnej (bez opcji edytowania))
3. podczas włączania bota dodać log w konsoli: "Thank you for using senti_client: <link>"

# strona senti client.com
zorbić stronę z:
1. podstrona dla wspierających
2. głosowanie co nowego dodać
3. zgłoszenia błędów
4. dokumentacja

kopia z SEEN- : bot_client.js

function getPermissionNames(bitfield) {
    var permissionNames = [];
    if (bitfield & 0x8n) permissionNames.push("ADMINISTRATOR");
    if (bitfield & 0x40000n) permissionNames.push("MANAGE_GUILD");
    if (bitfield & 0x400n) permissionNames.push("MANAGE_ROLES");
    if (bitfield & 0x80n) permissionNames.push("MANAGE_CHANNELS");
    if (bitfield & 0x100n) permissionNames.push("KICK_MEMBERS");
    if (bitfield & 0x200n) permissionNames.push("BAN_MEMBERS");
    if (bitfield & 0x400000n) permissionNames.push("CREATE_INSTANT_INVITE");
    if (bitfield & 0x1n) permissionNames.push("VIEW_CHANNEL");
    if (bitfield & 0x2n) permissionNames.push("SEND_MESSAGES");
    if (bitfield & 0x4n) permissionNames.push("SEND_TTS_MESSAGES");
    if (bitfield & 0x10n) permissionNames.push("MANAGE_MESSAGES");
    if (bitfield & 0x20n) permissionNames.push("EMBED_LINKS");
    if (bitfield & 0x40n) permissionNames.push("ATTACH_FILES");
    if (bitfield & 0x800n) permissionNames.push("READ_MESSAGE_HISTORY");
    if (bitfield & 0x1000n) permissionNames.push("MENTION_EVERYONE");
    if (bitfield & 0x2000n) permissionNames.push("USE_EXTERNAL_EMOJIS");
    if (bitfield & 0x8000n) permissionNames.push("ADD_REACTIONS");
    if (bitfield & 0x20000n) permissionNames.push("CONNECT");
    if (bitfield & 0x100000n) permissionNames.push("SPEAK");
    if (bitfield & 0x200000n) permissionNames.push("MUTE_MEMBERS");
    if (bitfield & 0x800000n) permissionNames.push("DEAFEN_MEMBERS");
    if (bitfield & 0x1000000n) permissionNames.push("MOVE_MEMBERS");
    if (bitfield & 0x4000000n) permissionNames.push("USE_VAD");

    return permissionNames;
}

kopia z dc.js:
export interface ConstantsColors {
  DEFAULT: 0x000000;
  WHITE: 0xffffff;
  AQUA: 0x1abc9c;
  GREEN: 0x57f287;
  BLUE: 0x3498db;
  YELLOW: 0xfee75c;
  PURPLE: 0x9b59b6;
  LUMINOUS_VIVID_PINK: 0xe91e63;
  FUCHSIA: 0xeb459e;
  GOLD: 0xf1c40f;
  ORANGE: 0xe67e22;
  RED: 0xed4245;
  GREY: 0x95a5a6;
  NAVY: 0x34495e;
  DARK_AQUA: 0x11806a;
  DARK_GREEN: 0x1f8b4c;
  DARK_BLUE: 0x206694;
  DARK_PURPLE: 0x71368a;
  DARK_VIVID_PINK: 0xad1457;
  DARK_GOLD: 0xc27c0e;
  DARK_ORANGE: 0xa84300;
  DARK_RED: 0x992d22;
  DARK_GREY: 0x979c9f;
  DARKER_GREY: 0x7f8c8d;
  LIGHT_GREY: 0xbcc0c0;
  DARK_NAVY: 0x2c3e50;
  BLURPLE: 0x5865f2;
  GREYPLE: 0x99aab5;
  DARK_BUT_NOT_BLACK: 0x2c2f33;
  NOT_QUITE_BLACK: 0x23272a;
}

dodać jakieś proste sprawdzanie czy poprawne dane były wprowadzone

wszystkei opdje Embeda do przetestowania

dodać token w .env żeby nie było tokena na githubie