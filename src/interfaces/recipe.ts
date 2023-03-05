interface Ingredients {
    name: string;
    amount: string;
}

export interface Recipe {
    _id: string;
    title: string;
    author: string;
    imageId: string;
    image: string;
    diet: string;
    ingredients: Array<Ingredients>
    instructions: string;
    cookTime: string;
    likes: number;
    dislikes: number;
}