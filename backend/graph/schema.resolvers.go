package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/alanqchen/Bear-Post/backend/graph/generated"
	"github.com/alanqchen/Bear-Post/backend/graph/model"
)

func (r *queryResolver) PostByID(ctx context.Context, id string) (*model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) PostBySlug(ctx context.Context, slug string) (*model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Posts(ctx context.Context, first *int, after *string) (*model.Posts, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) EditorPosts(ctx context.Context, first *int, after *string) (*model.Posts, error) {
	panic(fmt.Errorf("not implemented"))
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type queryResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *queryResolver) PostsEditor(ctx context.Context, startID *int) ([]*model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}
