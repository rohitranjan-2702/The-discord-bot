const Discord = require("discord.js");
const keepAlive = require("./server")
// const { SlashCommandBuilder } = require('discord.js');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const { REST, Routes } = require('discord.js');
// const reply = require("./reply")

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

const commands = [
    {
        name:'help',
        description: 'shows all help commands'
    },
    {
        name:'projects',
        description: 'display all open source projects '
    },
    {
        name:'about',
        description: 'know about clueless'
    }
    
  ];


  const reply = [
    {
        command:"help",
        content:"I am here to help you \n /projects: display all open source projects \n /about: about clueless \n /hackathons: all ongoing hackathons"
    },
    {
        command:"about",
        content:"Clueless is a student-driven development community built with the vision to make everyone fall in love with Open-source. 💻 We aim to create amazing open-source tools and repositories in every domain of software development. 🚀\n\nNot just another community, here each contribution of yours can make a great impact as it will be leveraged by developers around the world.😉"
    },
    {
        command:"projects",
        content:"ClueLess Official Website: \n https://github.com/Clueless-Community/clueless-official-website \n \n SeamLess UI: \n https://github.com/Clueless-Community/seamless-ui \n \n First Contribution Website: \n https://github.com/Clueless-Community/first-contribution \n \n College API: \n https://github.com/Clueless-Community/collegeAPI \n \n Prega.io: \n https://github.com/Clueless-Community/Prega \n \n Datasets: \n https://github.com/Clueless-Community/Datasets \n \n Flutter UI Components: \n https://github.com/Clueless-Community/flutter-ui-components \n \n FinTech API: \n https://github.com/Clueless-Community/fintech-api"
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();




client.on("ready", () => { console.log(`Logged in as ${client.user.tag}!`)});

client.on('messageCreate', (message) => {
    // console.log(message.content);
    // reads the user message content
})

// slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'help') {
      await interaction.reply(reply[0].content);
    }
    if (interaction.commandName === 'about') {
        await interaction.reply(reply[1].content);
    }
    if (interaction.commandName === 'projects') {
      await interaction.reply(reply[2].content);
    }
    
  });

  keepAlive()

client.login(process.env.TOKEN);