export class MockPostsService {
    static STARTUTC = 1388516058;

    static DESC = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

    static POSTURLS = [
      'https://www.reddit.com/r/progresspics/comments/9kt8ex/m0713_23lbs_13lbs_10lbs_still_a_bit_to_go_but_my/',
    ];

    static IMAGEURLS = [
      'https://i.redd.it/bzygw285fpp11.jpg',
    ];

    static getPosts(...args:any[]) {
      const after = this.STARTUTC;
      const posts = [];
      const now = Math.floor(Date.now() / 1000);
      for (let i = 0; i < limit; i++) {
        const startWeight = this.randInt(90, 300);
        const endWeight = this.randInt(90, 300);
        const urlIdx = this.randInt(0, this.POSTURLS.length);
        posts.push({
          id: i + 1,
          gender: this.choose(['M', 'F', undefined]),
          age: this.randInt(18, 100),
          startWeight,
          endWeight,
          weightChange: endWeight - startWeight,
          nsfw: this.choose([true, false]),
          createdAt: this.randInt(after, now),
          description: this.DESC,
          originalPost: this.POSTURLS[urlIdx],
          imageUrl: this.IMAGEURLS[urlIdx],
        });
      }
      return posts;
    }

    static choose(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    static randInt(start, end) {
      return start + Math.floor(Math.random() * (end - start));
    }
}
