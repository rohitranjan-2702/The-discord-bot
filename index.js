const Discord = require("discord.js");
// const { SlashCommandBuilder } = require('discord.js');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
// const { ActivityType } = require('discord.js');
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { reply} = require("./command")

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

// client.user.setActivity('activity', { type: ActivityType.Watching });

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

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

const slashCmds = (async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  });

  slashCmds();


client.on("ready", () => { console.log(`Logged in as ${client.user.tag}!`)});

const projectsEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Open Source Projects')
	.setURL('https://github.com/Clueless-Community')
	.setAuthor({ name: 'ClueLess', iconURL: 'https://www.clueless.tech/ClueLess%20Logo.png', url: 'https://www.clueless.tech/' })
	.setDescription('Here are the open-source where you guys can contribute.')
	.addFields(
    // { name: '\u200B', value: '\u200B' },
		{ name: '- ClueLess Official Website', value: 'This is Clueless official website where you can make your developer profile as well as meet new people across the world. \n \n 🔗 - https://github.com/Clueless-Community/clueless-official-website\n \n'  },
	 // add a blank field to the embed
		{ name: '- SeamLess UI', value: 'This is a Web UI Kit made with simple HTML and Tailwind CSS. You can use them in any of your projects, be it a simple HTML, CSS static website or a React, Vue, Angular or Next.js Complex app. \n \n 🔗 - https://github.com/Clueless-Community/seamless-ui\n \n' },
		{ name: '- First Contribution Website', value: 'A repo where you can make your first contribution and get a contributors card in our website. \n \n 🔗 - https://github.com/Clueless-Community/first-contribution' },
		
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', })
	.setImage('https://blog.hyperiondev.com/wp-content/uploads/2018/11/Blog-GitHub.jpg')
	.setTimestamp()
	.setFooter({ text: 'by ClueLess', iconURL: 'https://www.clueless.tech/ClueLess%20Logo.png' });

client.on('messageCreate', (message) => {
    // console.log(message.content);
    // reads the user message content
    // message.reply("hello");
    if (message.content === 'hello'){
      message.reply("Hello buddy, how are you?")
    }
    if (message.content === 'projects'){
      message.channel.send({ embeds: [projectsEmbed] });
    }

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

  // keepAlive()

client.login(process.env.TOKEN);

