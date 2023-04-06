interface Ingredients {
    name: string;
    amount: string;
}

interface LikedBy {
    likeAuthorId: string;
}

export interface Recipe {
    _id: string;
    title: string;
    authorId: string;
    authorName: string;
    image: string;
    imageUrl: string;
    diet: string;
    ingredients: Array<Ingredients>
    instructions: string;
    cookTime: string;
    likes: number;
    dislikes: number;
    likedBy: Array<LikedBy>;
    isFlagged: boolean;
}