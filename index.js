import { Client as _Client } from "discord.js";
import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import { REST, Routes } from "discord.js";
import reply from "./src/command.js";
import fetch from "node-fetch";

import {} from "dotenv/config.js";

const client = new _Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// client.user.setActivity('activity', { type: ActivityType.Watching });

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const commands = [
  {
    name: "help",
    description: "shows all help commands",
  },
  {
    name: "projects",
    description: "display all open source projects",
  },
  {
    name: "about",
    description: "know about clueless",
  },
  {
    name: "dashboard",
    description: "github dashboard",
  },
];

const slashCmds = async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};

slashCmds();

let reposData = "";

const getRepos = async () => {
  const response = await fetch(
    "https://api.github.com/orgs/Clueless-Community/repos"
  );
  const data = await response.json();

  // console.log(data);

  data.map((repo) => {
    reposData += `Open Source Projects: \n Name: ${repo.name} \n URL: ${repo.html_url} \n`;
  });

  // console.log(reposData);
};

getRepos();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const projectsEmbed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle("Open Source Projects")
  .setURL("https://github.com/Clueless-Community")
  .setAuthor({
    name: "ClueLess",
    iconURL: "https://www.clueless.tech/ClueLess%20Logo.png",
    url: "https://www.clueless.tech/",
  })
  .setDescription("Here are the open-source where you guys can contribute.")
  .addFields(
    // { name: '\u200B', value: '\u200B' },
    {
      name: "- ClueLess Official Website",
      value:
        "This is Clueless official website where you can make your developer profile as well as meet new people across the world. \n \n 🔗 - https://github.com/Clueless-Community/clueless-official-website\n \n",
    },
    // add a blank field to the embed
    {
      name: "- SeamLess UI",
      value:
        "This is a Web UI Kit made with simple HTML and Tailwind CSS. You can use them in any of your projects, be it a simple HTML, CSS static website or a React, Vue, Angular or Next.js Complex app. \n \n 🔗 - https://github.com/Clueless-Community/seamless-ui\n \n",
    },
    {
      name: "- First Contribution Website",
      value:
        "A repo where you can make your first contribution and get a contributors card in our website. \n \n 🔗 - https://github.com/Clueless-Community/first-contribution",
    }
  )
  .addFields({ name: "Inline field title", value: "Some value here" })
  .setImage(
    "https://blog.hyperiondev.com/wp-content/uploads/2018/11/Blog-GitHub.jpg"
  )
  .setTimestamp()
  .setFooter({
    text: "by ClueLess",
    iconURL: "https://www.clueless.tech/ClueLess%20Logo.png",
  });

//  custom respond on message
client.on("messageCreate", (message) => {
  // console.log(message.content);
  // reads the user message content
  // message.reply("hello");
  if (message.content === "hello") {
    message.reply("Hello buddy, how are you?");
  }
  if (message.content === "Clueless") {
    message.channel.send({ embeds: [projectsEmbed] });
  }
});

// slash commands
client.on("interactionCreate", async (interaction) => {
  // console.log(interaction); // the interaction object
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "help") {
    await interaction.reply(reply[0].content);
  }
  if (interaction.commandName === "about") {
    await interaction.reply(reply[1].content);
  }
  if (interaction.commandName === "projects") {
    await interaction.reply(reposData);
  }
  // generate github dasboard from the username of member
  if (interaction.commandName === "dashboard") {
    await interaction.reply("Enter your github username").then(() => {
      const collector = interaction.channel.createMessageCollector({
        // filter: collectorFilter,
        time: 15000,
      });

      let githubData = [];
      let username = "";

      collector.on("collect", async (m) => {
        // console.log(`Collected ${m.content}`); // message content given by user
        username = m.content;
      });

      collector.on("end", async (collected) => {
        // console.log(`Collected ${collected.size} items`);
        const response = await fetch(
          `https://api.github.com/users/${username}`
        );
        const data = await response.json();

        githubData.push(data);

        const followers = githubData[0].followers;
        const following = githubData[0].following;
        const public_repos = githubData[0].public_repos;
        const blog = githubData[0].blog;

        // console.log(followers);

        // console.log(data);
        // console.log(githubData[0]);
        const dashboardEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(githubData[0].name)
          .setURL(githubData[0].html_url)
          .setAuthor({
            name: "Github Dashboard",
            iconURL: githubData[0].avatar_url,
            url: githubData[0].html_url,
          })
          .setDescription(githubData[0].bio)
          .addFields(
            // { name: '\u200B', value: '\u200B' },
            {
              name: "Website",
              value: `${blog}`,
            },
            {
              name: "Following",
              value: `${following}`,
            },
            {
              name: "Followers",
              value: `${followers}`,
            },
            {
              name: "Public Repositories",
              value: `${public_repos}`,
            }
          )
          // .addFields({ name: "Inline field title", value: "Some value here" })
          .setImage(
            "https://blog.hyperiondev.com/wp-content/uploads/2018/11/Blog-GitHub.jpg"
          )
          .setTimestamp()
          .setFooter({
            text: "by RoHiT",
          });
        interaction.channel.send({ embeds: [dashboardEmbed] });
      });
    });
  }
});

// keepAlive()

client.login(process.env.TOKEN);
