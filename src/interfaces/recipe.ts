interface Ingredients {
    name: string;
    amount: string;
}

interface LikedBy {
    likeAuthorId: string;
}

interface Comments {
    commentAuthorId: string;
    commentAuthorName: string;
    commentContent: string;
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
    comments: Array<Comments>;
    isFlagged: boolean;
}