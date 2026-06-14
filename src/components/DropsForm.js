import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { useAuth } from '../contexts/AuthContext';
import {
  Box, TextField, Button, Typography, Alert, CircularProgress,
  Select, MenuItem, FormControl, InputLabel, Chip, Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ADMIN_UID = 'vqwpiGlbosQWkuSkfI5aFXdaAiZ2';

const STATUS_OPTIONS = ['upcoming', 'live', 'sold-out', 'archived'];

const DropsForm = ({ drop = null }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(drop?.name || '');
  const [description, setDescription] = useState(drop?.description || '');
  const [dropStory, setDropStory] = useState(drop?.dropStory || '');
  const [collectorNotes, setCollectorNotes] = useState(drop?.collectorNotes || '');
  const [price, setPrice] = useState(drop?.price || '');
  const [status, setStatus] = useState(drop?.status || 'upcoming');
  const [editionSize, setEditionSize] = useState(drop?.editionSize || '');
  const [stockRemaining, setStockRemaining] = useState(drop?.stockRemaining || '');
  const [dropDate, setDropDate] = useState(drop?.dropDate ? new Date(drop.dropDate.toDate()).toISOString().slice(0, 16) : '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(drop?.tags || []);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(drop?.imageUrls || []);
  const [displayReady, setDisplayReady] = useState(drop?.displayReady ?? true);
  const [includesStoryCard, setIncludesStoryCard] = useState(drop?.includesStoryCard ?? true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    const compressed = [];
    for (const file of files) {
      try {
        const c = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
        compressed.push(c);
      } catch { compressed.push(file); }
    }
    setImages(compressed);
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
    if (!currentUser || currentUser.uid !== ADMIN_UID) {
      setError('Unauthorized.');
      return;
    }
    if (!name.trim()) { setError('Name is required.'); return; }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let imageUrls = [...existingImages];
      for (const img of images) {
        const storageRef = ref(storage, `drop_images/${Date.now()}_${img.name}`);
        await uploadBytes(storageRef, img);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      const dropData = {
        name: name.trim(),
        description: description.trim(),
        dropStory: dropStory.trim(),
        collectorNotes: collectorNotes.trim(),
        price: price ? parseFloat(price) : null,
        status,
        editionSize: editionSize ? parseInt(editionSize) : 0,
        stockRemaining: stockRemaining ? parseInt(stockRemaining) : (editionSize ? parseInt(editionSize) : 0),
        dropDate: dropDate ? new Date(dropDate) : null,
        tags,
        imageUrls,
        displayReady,
        includesStoryCard,
        updatedAt: serverTimestamp(),
      };

      if (drop) {
        await updateDoc(doc(db, 'drops', drop.id), dropData);
        setSuccess('Drop updated!');
      } else {
        const newDoc = await addDoc(collection(db, 'drops'), { ...dropData, createdAt: serverTimestamp() });
        setSuccess('Drop created!');
        setTimeout(() => navigate(`/drops/${newDoc.id}`), 1500);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save drop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', pt: { xs: 10, md: 12 }, pb: 8, px: 2 }}>
      <Typography variant="h4" sx={{ color: '#f1f5f9', mb: 1 }}>{drop ? 'Edit Drop' : 'Create New Drop'}</Typography>
      <Typography sx={{ color: '#64748b', mb: 4, fontSize: '0.875rem' }}>
        Fill in the drop details. The story card and collector notes make each release feel premium.
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField label="Drop Name *" value={name} onChange={e => setName(e.target.value)} required fullWidth />
        <TextField label="Short Description" value={description} onChange={e => setDescription(e.target.value)} multiline rows={3} fullWidth placeholder="Describe the piece in 1-2 sentences..." />
        <TextField label="Drop Story (Markdown supported)" value={dropStory} onChange={e => setDropStory(e.target.value)} multiline rows={6} fullWidth placeholder="The full story behind this drop — why it was made, the inspiration, the details..." />
        <TextField label="Collector Notes" value={collectorNotes} onChange={e => setCollectorNotes(e.target.value)} multiline rows={3} fullWidth placeholder="Care instructions, display suggestions, rarity notes..." />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField label="Price (USD)" type="number" value={price} onChange={e => setPrice(e.target.value)} fullWidth inputProps={{ min: 0, step: 0.01 }} placeholder="29.99" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Edition Size" type="number" value={editionSize} onChange={e => setEditionSize(e.target.value)} fullWidth inputProps={{ min: 1 }} placeholder="50" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Stock Remaining" type="number" value={stockRemaining} onChange={e => setStockRemaining(e.target.value)} fullWidth inputProps={{ min: 0 }} placeholder="50" />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={status} label="Status" onChange={e => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Drop Date & Time"
              type="datetime-local"
              value={dropDate}
              onChange={e => setDropDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
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
            placeholder="e.g. anime, collectible, limited..."
          />
          {tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {tags.map(tag => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  onDelete={() => setTags(tags.filter(t => t !== tag))}
                  sx={{ background: '#14141f', border: '1px solid #1e1e30', color: '#64748b' }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Feature flags */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {[
            { label: 'Display Ready', state: displayReady, set: setDisplayReady },
            { label: 'Includes Story Card', state: includesStoryCard, set: setIncludesStoryCard },
          ].map(flag => (
            <Box
              key={flag.label}
              onClick={() => flag.set(!flag.state)}
              sx={{
                px: 2, py: 1, borderRadius: '10px', cursor: 'pointer',
                background: flag.state ? 'rgba(139,92,246,0.1)' : '#14141f',
                border: `1px solid ${flag.state ? 'rgba(139,92,246,0.4)' : '#1e1e30'}`,
                color: flag.state ? '#a78bfa' : '#64748b',
                fontFamily: '"Space Grotesk"', fontWeight: 600, fontSize: '0.8rem',
                userSelect: 'none', transition: 'all 0.2s',
              }}
            >
              {flag.state ? '✓ ' : ''}{flag.label}
            </Box>
          ))}
        </Box>

        {/* Images */}
        <Box>
          <Typography sx={{ color: '#64748b', fontSize: '0.8rem', mb: 1, fontWeight: 600 }}>Product Images</Typography>
          {existingImages.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
              {existingImages.map((url, i) => (
                <Box key={i} sx={{ position: 'relative' }}>
                  <Box component="img" src={url} sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px', border: '1px solid #1e1e30' }} />
                  <Box
                    onClick={() => setExistingImages(existingImages.filter((_, j) => j !== i))}
                    sx={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', cursor: 'pointer' }}
                  >×</Box>
                </Box>
              ))}
            </Box>
          )}
          <Button variant="outlined" component="label" size="small" sx={{ borderColor: '#1e1e30', color: '#64748b' }}>
            Upload Images
            <input type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
          </Button>
          {images.length > 0 && (
            <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.5 }}>{images.length} new image(s) selected</Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
          <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 140 }}>
            {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : drop ? 'Update Drop' : 'Create Drop'}
          </Button>
          <Button component="a" href="/drops" variant="outlined" sx={{ borderColor: '#1e1e30', color: '#64748b' }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DropsForm;
