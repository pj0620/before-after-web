import axios from 'axios';
import { BeforeAfterPicture } from '../models';
import { CONSTANTS } from '@/constants';
import { SearchParams } from '@/models/search-params.model';

export class BeforeAfterPicsService {
  public static async getPosts(params?:Partial<SearchParams>): Promise<BeforeAfterPicture[]> {
    const res = await axios({
      method: 'get',
      url: CONSTANTS.BASE_URL + CONSTANTS.POSTS,
      data: null,
      params,
    });
    console.log(`res -> ${JSON.stringify(res)}`);
    if (res.status === 200) {
      return res.data as BeforeAfterPicture[];
    }
    console.error('error while getting posts');
    return [];
  }
}

export class MockPostsService {
    private static readonly STARTUTC: number = 1388516058;

    // eslint-disable-next-line vue/max-len
    private static readonly DESC:string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

    private static readonly POSTURLS:string[] = [
      'https://www.reddit.com/r/progresspics/comments/9kt8ex/m0713_23lbs_13lbs_10lbs_still_a_bit_to_go_but_my/',
    ]

    private static readonly IMAGEURLS:string[] = [
      'https://i.redd.it/bzygw285fpp11.jpg',
    ]

    public static getPosts(): BeforeAfterPicture[] {
      const posts:BeforeAfterPicture[] = [];

      // passed as param later
      const after = this.STARTUTC;
      const limit = 10;

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

    private static choose<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    private static randInt(start:number, end:number): number {
      return start + Math.floor(Math.random() * (end - start));
    }
}
