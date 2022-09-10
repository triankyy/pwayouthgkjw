//user interface
export interface IUser {
      id: number;
      name: string;
      level: number;
      email: string;
      password: string;
      created_at: Date;
      updated_at: Date;
}

//carousel interface
export interface ICarousel {
      id: number;
      image: string;
      label: string;
      user: IUser;
      created_at: Date;
      updated_at: Date;
}

//carousel youtube
export interface IYoutube {
      title: string;
      description: string;
      url: string;
      videoId: string;
      seconds: number;
      timestamp: string;
      duration: IDuration;
      views: number;
      genre: string;
      uploadDate: string;
      ago: string;
      image: string;
      thumbnail: string;
      author: IAuthor;
      id: number;
      youtube_id: string;
      created_at: string;
      updated_at: string;
      user: IUser;
}

interface IDuration {
      seconds: number;
      timestamp: string;
}

interface IAuthor {
      name: string;
      url: string;
}