package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/alanqchen/Bear-Post/backend/graph/generated"
	"github.com/alanqchen/Bear-Post/backend/graph/model"
)

func (r *mutationResolver) GetPosts(ctx context.Context, input *model.GetPosts) ([]*model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }
