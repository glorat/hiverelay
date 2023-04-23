<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md">
      <div class="q-gutter-md">
        <div class="q-col-12">
          <q-card>
            <q-card-section class="q-pa-md">
              <q-input outlined v-model="newTweetText" label="What's happening?" @keyup.enter="postTweet" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn label="Tweet" color="primary" @click="postTweet" />
            </q-card-actions>
          </q-card>
        </div>
        <div class="q-col-12">
          <q-card>
            <q-card-section class="q-pa-md">
              <div v-for="tweet in tweets" :key="tweet.id">
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <img v-if="tweet.user.avatar" :src="tweet.user.avatar" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      <b>{{ tweet.user.name }}</b>
                      <span class="text-grey">{{ tweet.user.handle }}</span>
                      <span class="text-grey">{{ tweet.createdAt?.toDate() }}</span>
                    </q-item-label>
                    <q-item-label>{{ tweet.text }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {onMounted, ref, Ref} from 'vue'
import {dbGetAllMessages, dbGetMyMessages, dbUpsertMessage} from 'src/lib/dal'

const newTweetText = ref('');
const tweets:Ref<any[]> = ref([
  {
    id: 1,
    user: {
      name: 'John Smith',
      handle: '@johnsmith',
      avatar: 'https://cdn.quasar.dev/img/avatar.png'
    },
    text: 'Just posted my first tweet!',
    time: '1h ago'
  },
  {
    id: 2,
    user: {
      name: 'Jane Doe',
      handle: '@janedoe',
      avatar: 'https://cdn.quasar.dev/img/avatar2.jpg'
    },
    text: 'I love Quasar Framework!',
    time: '2h ago'
  },
  // ...more tweets here
]);

const refreshTweets = async() => {
  const messages = await dbGetAllMessages()
  tweets.value = messages.map(doc => ({... doc.data(), id:doc.id}))
}

const postTweet = async () => {
  // TODO: Add code to post the new tweet to Firestore
  const message = {
    id: tweets.value.length + 1,
    user: {
      name: 'Your Name',
      id: '123',
      handle: '@yourhandle',
      avatar: 'https://cdn.quasar.dev/img/avatar3.jpg'
    },
    text: newTweetText.value
  }
  await dbUpsertMessage(message)
  await refreshTweets()
  newTweetText.value = '';
};

onMounted(async () => {
  await refreshTweets()
})

</script>
