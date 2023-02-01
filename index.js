const Discord = require("discord.js");
// const keepAlive = require("./server")
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

const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Open Source')
	.setURL('https://downloadr2.apkmirror.com/wp-content/uploads/2021/06/64/60d43b9abaafc.png')
	.setAuthor({ name: 'ClueLess', iconURL: 'https://downloadr2.apkmirror.com/wp-content/uploads/2021/06/64/60d43b9abaafc.png', url: 'https://downloadr2.apkmirror.com/wp-content/uploads/2021/06/64/60d43b9abaafc.png' })
	.setDescription('Demo description')
	.setThumbnail('https://downloadr2.apkmirror.com/wp-content/uploads/2021/06/64/60d43b9abaafc.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	.setImage('https://downloadr2.apkmirror.com/wp-content/uploads/2021/06/64/60d43b9abaafc.png')
	.setTimestamp()
	.setFooter({ text: 'by ClueLess', iconURL: 'https://downloadr2.apkmirror.com/wp-content/uploads/2021/06/64/60d43b9abaafc.png' });

client.on('messageCreate', (message) => {
    // console.log(message.content);
    // reads the user message content
    // message.reply("hello");
    if (message.content === 'hello'){
      message.reply("Hello buddy, how are you?")
      message.channel.send({ embeds: [exampleEmbed] });
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