import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { useAuth } from '../contexts/AuthContext';
import {
  TextField, Button, Box, CircularProgress, Alert, Typography,
  FormControl, InputLabel, Select, MenuItem, Chip, Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ADMIN_UID = 'vqwpiGlbosQWkuSkfI5aFXdaAiZ2';

const CATEGORIES = [
  { value: 'power-rankings', label: '⚡ Power Rankings' },
  { value: 'collector-guides', label: '🃏 Collector Guides' },
  { value: 'nostalgia-vault', label: '📼 Nostalgia Vault' },
  { value: 'card-of-the-week', label: '🎴 Card of the Week' },
  { value: 'battle-debate', label: '⚔️ Battle Debate' },
  { value: 'beginner-guides', label: '📖 Beginner Guides' },
  { value: 'drop-story', label: '🎁 Drop Story' },
  { value: 'display-setup', label: '🖼 Display Setup' },
  { value: 'worth-it', label: '🤔 Worth It or Overhyped?' },
];

const BlogForm = ({ post = null }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [author, setAuthor] = useState(post?.author || '');
  const [postSummary, setPostSummary] = useState(post?.postSummary || '');
  const [category, setCategory] = useState(post?.category || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(post?.tags || []);
  const [featured, setFeatured] = useState(post?.featured || false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.imageUrl || null);
  const [imageAlt, setImageAlt] = useState(post?.imageAlt || '');
  const [videoId, setVideoId] = useState(post?.videoId || '');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) { setError('Only JPEG, PNG, GIF, WEBP, AVIF allowed.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return; }
    try {
      const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
      setImage(compressed);
      setImagePreview(URL.createObjectURL(compressed));
      setError('');
    } catch { setError('Image compression failed.'); }
  };

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      if (!tags.includes(tag)) setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!title.trim() || !content.trim() || !author.trim() || !postSummary.trim()) {
      setError('Title, content, author, and summary are required.');
      return;
    }
    if (!currentUser || currentUser.uid !== ADMIN_UID) {
      setError('Unauthorized.');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = post?.imageUrl || '';
      if (image) {
        const storageRef = ref(storage, `blog_images/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const postData = {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        postSummary: postSummary.trim(),
        category,
        tags,
        featured,
        imageUrl,
        imageAlt: imageAlt.trim(),
        videoId: videoId.trim(),
        updatedAt: serverTimestamp(),
      };

      if (post) {
        await updateDoc(doc(db, 'posts', post.id), postData);
        setSuccess('Post updated successfully!');
      } else {
        const newDoc = await addDoc(collection(db, 'posts'), {
          ...postData,
          likes: 0,
          createdAt: serverTimestamp(),
        });
        setSuccess('Post created!');
        setTimeout(() => navigate(`/articles/${newDoc.id}`), 1500);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', pt: { xs: 10, md: 12 }, pb: 8, px: 2 }}>
      <Typography variant="h4" sx={{ color: '#f1f5f9', mb: 1 }}>{post ? 'Edit Article' : 'New Article'}</Typography>
      <Typography sx={{ color: '#64748b', mb: 4, fontSize: '0.875rem' }}>
        Markdown is supported in the content field. Add a summary for the article card preview.
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField label="Title *" value={title} onChange={e => setTitle(e.target.value)} required fullWidth />
        <TextField label="Post Summary (used in card previews) *" value={postSummary} onChange={e => setPostSummary(e.target.value)} required fullWidth multiline rows={2} placeholder="1-2 sentence hook that appears on the article card." />
        <TextField label="Content * (Markdown supported)" value={content} onChange={e => setContent(e.target.value)} required fullWidth multiline rows={14} placeholder="Write your article in Markdown..." />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Author Name *" value={author} onChange={e => setAuthor(e.target.value)} required fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={e => setCategory(e.target.value)}>
                <MenuItem value=""><em>None</em></MenuItem>
                {CATEGORIES.map(cat => <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Tags */}
        <Box>
          <TextField
            label="Tags (press Enter to add)"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            fullWidth
            placeholder="e.g. pokemon, tcg, nostalgia"
          />
          {tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {tags.map(tag => (
                <Chip key={tag} label={`#${tag}`} size="small" onDelete={() => setTags(tags.filter(t => t !== tag))} sx={{ background: '#14141f', border: '1px solid #1e1e30', color: '#64748b' }} />
              ))}
            </Box>
          )}
        </Box>

        {/* Featured toggle */}
        <Box
          onClick={() => setFeatured(!featured)}
          sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1,
            borderRadius: '10px', cursor: 'pointer', width: 'fit-content',
            background: featured ? 'rgba(245,158,11,0.1)' : '#14141f',
            border: `1px solid ${featured ? 'rgba(245,158,11,0.4)' : '#1e1e30'}`,
            color: featured ? '#fbbf24' : '#64748b',
            fontFamily: '"Space Grotesk"', fontWeight: 600, fontSize: '0.8rem', userSelect: 'none',
          }}
        >
          {featured ? '⚡ Simba\'s Pick — On' : '⚡ Mark as Simba\'s Pick'}
        </Box>

        {/* Image */}
        <Box>
          <Typography sx={{ color: '#64748b', fontSize: '0.8rem', mb: 1, fontWeight: 600 }}>Featured Image</Typography>
          {imagePreview && (
            <Box sx={{ mb: 1.5, borderRadius: '12px', overflow: 'hidden', maxHeight: 240, border: '1px solid #1e1e30' }}>
              <Box component="img" src={imagePreview} alt="Preview" sx={{ width: '100%', objectFit: 'cover' }} />
            </Box>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label" fullWidth sx={{ borderColor: '#1e1e30', color: '#64748b' }}>
                {image ? image.name : 'Upload Image'}
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField size="small" label="Image Alt Text" value={imageAlt} onChange={e => setImageAlt(e.target.value)} fullWidth />
            </Grid>
          </Grid>
        </Box>

        <TextField
          label="YouTube Video ID (optional)"
          value={videoId}
          onChange={e => setVideoId(e.target.value)}
          fullWidth
          placeholder="e.g. dQw4w9WgXcQ"
          helperText="Just the video ID from the YouTube URL, not the full link."
        />

        <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
          <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 140 }}>
            {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : post ? 'Update Article' : 'Publish Article'}
          </Button>
          <Button component="a" href="/articles" variant="outlined" sx={{ borderColor: '#1e1e30', color: '#64748b' }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BlogForm;
