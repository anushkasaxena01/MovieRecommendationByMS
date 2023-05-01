// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.


const { ActivityHandler } = require('botbuilder');
const axios = require('axios');

class MovieBot extends ActivityHandler {
    constructor() {
        super();

        // Welcome message
        this.onMembersAdded(async(context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let i = 0; i < membersAdded.length; i++) {
                if (membersAdded[i].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome to the Movie Recommendation Bot!📽️');
                }
            }
            await next();
        });

        // Movie recommendation handler
        this.onMessage(async(context, next) => {
            const userInput = context.activity.text.toLowerCase();

            if (userInput.includes('recommend a movie')) {
                try {
                    const apiKey = 'eea8080a4e9a11913653113008ad3591';
                    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`);
                    const results = response.data.results;
                    const randomIndex = Math.floor(Math.random() * results.length);
                    const randomMovie = results[randomIndex];

                    await context.sendActivity(`
            Recommended movie: ${randomMovie.title}
            Summary: ${randomMovie.overview}
            Rating: ${randomMovie.vote_average}
          `);
                } catch (error) {
                    console.error(error);
                    await context.sendActivity('Oops, something went wrong! Please try again later.');
                }
            } else {
                await context.sendActivity(`Sorry, I didn't understand "${userInput}". Please type "recommend a movie" to get a movie recommendation.`);
            }

            await next();
        });
    }
}

module.exports.MovieBot = MovieBot;