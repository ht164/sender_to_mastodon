const Twitter = require('twitter');
const fs = require('fs');
const fetch = require('node-fetch');
const Masto = require('masto').Masto;

const client = new Twitter({
    consumer_key: 'TWITTER_APP_CONSUMER_KEY',
    consumer_secret: 'TWITTER_APP_CONSUMER_SECRET',
    access_token_key: 'TWITTER_APP_ACCESS_TOKEN_KEY',
    access_token_secret: 'TWITTER_APP_ACCESS_TOKEN_SECRET'
});

function main() {
    let param = {
        exclude_replies: true,
        include_rts: false,
        trim_user: true,
        count: 10
    };
    client.get('statuses/user_timeline', param)
        .then (async (tweets) => {
            let toots = await findTweets(tweets);
            console.log('Getting Tweet is done.');
            await tootToMastodon(toots);
            console.log('Tooting is done.');
        })
        .catch ((error) => {
            console.log("ERROR: " + error);
        });
}

/**
 * Find tweets that contains hashtag #g2mastdn and
 * return array of them.
 * 
 * @param {*} tweets Tweet array returned from Twitter.
 */
async function findTweets(tweets) {
    let ar = [];
    const regex_tco = /https:\/\/t.co\/[A-Za-z0-9]*/;
    const regex_hashtag = /#g2mstdn/;

    for (tweet of tweets) {
        let content = tweet.text;
        
        if (tweet.text.search(/#g2mstdn/) !== -1) {
            // save image file.
            let imgfilename = '';
            if (tweet.entities.media) {
                let imgfile = tweet.entities.media[0].media_url_https + ':large';
                let localimgfile = '' + tweet.id + '.dat';
                imageStoreId = '' + tweet.id;
                console.log('Download ' + imgfile);
                let res = await fetch(imgfile);
                let buf = await res.buffer();
                fs.writeFileSync(localimgfile, buf);
                imgfilename = localimgfile;
            }

            // remove t.co link.
            content = content.replace(regex_tco, '');

            // remove hashtag
            content = content.replace(regex_hashtag, '');

            ar.push({
                content: content,
                imgfile: imgfilename
            });
        }
    }
    return ar;
}

/**
 * Toot arg (toots) to Mastodon.
 * 
 * @param {*} toots Array of toot data.
 */
async function tootToMastodon(toots) {
    const masto = await Masto.login({
        uri: 'MASTODON_INSTANCE_URI',
        accessToken: 'MASTODON_ACCESS_TOKEN'
    });
    // hack
    masto.version = masto.version.replace(/ht/, '');

    for (toot of toots) {
        // upload media.
        let mediaIds = [];
        if (toot.imgfile !== '') {
            let attachment = await masto.createMediaAttachment({
                file: fs.createReadStream(toot.imgfile)
            });
            mediaIds.push(attachment.id);
        }

        // toot.
        await masto.createStatus({
            mediaIds: mediaIds,
            status: toot.content,
            visibility: 'public'
        });
    }
}

main();