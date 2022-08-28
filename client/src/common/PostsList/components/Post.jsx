import { AiOutlineHeart } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { MdOutlineModeComment } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import tw, { styled } from 'twin.macro';
import { createPostUrl, formatDate } from '../../../helpers/string';
import { calcReadingTime } from '../../../helpers/utils';
import usePostReaction from '../../../hooks/usePostReaction';
import useRequireAuth from '../../../hooks/useRequireAuth';
import Tags from '../../Tags';

const Post = ({ post, isFirstPost, filteredTag }) => {
  const navigate = useNavigate();
  const { isAuthed, handleAuth } = useRequireAuth(false);

  const { id, author, likes, unicorns, bookmarks } = post;
  const likesArr = [...likes];
  const unicornsArr = [...unicorns];
  const bookmarksArr = [...bookmarks];

  const { state, handleReaction } = usePostReaction(
    id,
    author,
    likesArr,
    unicornsArr,
    bookmarksArr,
    post.title
  );
  const { isBookmarked } = state;

  const handleSave = () => {
    const action = isBookmarked ? 'removeBookmark' : 'bookmark';
    const effect = isBookmarked ? 'negative' : 'positive';

    if (isAuthed) handleReaction(action, effect, bookmarksArr, 'isBookmarked');
    else handleAuth();
  };

  return (
    post && (
      <Wrapper>
        {isFirstPost && (
          <Image
            onClick={() =>
              navigate(`/${post.author?.username}/${createPostUrl(post.title, post.id)}`)
            }
            src={post.image.url}
          />
        )}
        <Content>
          <Header onClick={() => navigate(`/${post?.author.username}`)}>
            <Author src={post.author?.picture.url} />
            <AuthorMeta>
              <AuthorName>{post.author?.username}</AuthorName>
              <CreatedAt>{formatDate(post.createdAt)}</CreatedAt>
              {formatDate(post.updatedAt) !== formatDate(post.createdAt) && (
                <UpdatedAt>{`Last updated ${formatDate(post.updatedAt)}`}</UpdatedAt>
              )}
            </AuthorMeta>
          </Header>
          <Title
            onClick={() =>
              navigate(`/${post.author.username}/${createPostUrl(post.title, post.id)}`)
            }>
            {post.title}
          </Title>
          <Tags tags={post.tags} filteredTag={filteredTag} />
          <Footer>
            <Reactions
              onClick={() =>
                navigate(`/${post.author.username}/${createPostUrl(post.title, post.id)}`)
              }>
              <SumOfReactions>
                <HeartIcon>
                  <AiOutlineHeart />
                </HeartIcon>
                <Total>
                  {post.likes.length + post.unicorns.length + post.bookmarks.length} reactions
                </Total>
              </SumOfReactions>
              <SumOfComments>
                <CommentIcon>
                  <MdOutlineModeComment />
                </CommentIcon>
                <Total>{post.comments?.length} comments</Total>
              </SumOfComments>
            </Reactions>
            <Other>
              <MinutesRead>{calcReadingTime(post.body)}</MinutesRead>
              <SaveButton onClick={handleSave} isBookmarked={isBookmarked}>
                {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
              </SaveButton>
            </Other>
          </Footer>
        </Content>
      </Wrapper>
    )
  );
};

const Image = styled.img`
  width: 100%;
  height: 450px;
  object-fit: cover;
  cursor: pointer;
`;
const Content = tw.div`px-sm py-md`;
const Header = tw.div`flex justify-between items-center w-max gap-sm mb-2 `;
const Author = tw.img`w-10 h-10 rounded-full cursor-pointer`;
const AuthorMeta = tw.div``;
const AuthorName = tw.h4`text-darker-gray pr-1 pt-1 rounded-md hover:bg-lighter-gray cursor-pointer`;
const CreatedAt = tw.p`text-darker-gray`;
const UpdatedAt = tw.p`text-darker-gray`;
const Title = tw.h1`mb-2 hover:text-blue cursor-pointer`;
const Footer = tw.div`flex justify-between items-center`;
const Reactions = tw.div`flex justify-between items-center gap-md`;
const SumOfReactions = tw.div`flex justify-between items-center gap-2 text-darker-gray rounded-md px-2 py-1 hover:bg-lighter-gray cursor-pointer`;
const HeartIcon = styled.div`
  svg {
    font-size: 1.5rem;
  }
`;
const SumOfComments = tw.div`flex justify-between items-center gap-2 text-darker-gray rounded-md px-2 py-1 hover:bg-lighter-gray cursor-pointer`;
const CommentIcon = styled.div`
  svg {
    font-size: 1.5rem;
  }
`;
const Total = tw.p``;
const Other = tw.div`flex justify-between items-center gap-2`;
const MinutesRead = tw.p`text-darker-gray`;
const SaveButton = styled.button`
  ${tw`p-2 border text-lg border-solid border-transparent rounded-md hover:(text-blue bg-light-blue)`}
  ${({ isBookmarked }) => isBookmarked && tw`bg-light-gray`}
`;
const Wrapper = tw.div`rounded-md w-full overflow-hidden bg-white mb-2`;

export default Post;
