import { Box, Typography, Paper, ToggleButton, ToggleButtonGroup, Divider } from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { FormatBold, FormatItalic, FormatUnderlined, FormatListBulleted, FormatListNumbered, Title, Link as LinkIcon, Code } from '@mui/icons-material';
import { Requisition } from '@/interface/requisition';
import { useEffect } from 'react';

interface JobDescriptionProps {
  requisition: Partial<Requisition>;
  isEditMode?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 1, mb: 2}}>
      <ToggleButtonGroup size="small" aria-label="text formatting">
        <ToggleButton
          value="bold"
          selected={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FormatBold fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="italic"
          selected={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FormatItalic fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="underline"
          selected={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FormatUnderlined fontSize="small" />
        </ToggleButton>
        <ToggleButton
            value="heading"
            selected={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
            <Title fontSize="small" />
        </ToggleButton>
        <ToggleButton
            value="bulletList"
            selected={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
            <FormatListBulleted fontSize="small" />
        </ToggleButton>
         <ToggleButton
            value="orderedList"
            selected={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
            <FormatListNumbered fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

const JobDescription = ({ requisition, isEditMode = false }: JobDescriptionProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
          openOnClick: false,
      }),
    ],
    immediatelyRender: false,
    content: requisition.job_description || '<p>No job description available.</p>',
    editable: isEditMode,
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px]',
        },
    },
  });

  // Update content if requisition changes (e.g. after fetch)
  useEffect(() => {
      if (editor && requisition.job_description) {
          // Only set content if it's different to avoid cursor jumps, 
          // but here we just set it on mount/change mostly.
          if (editor.getHTML() !== requisition.job_description) {
             editor.commands.setContent(requisition.job_description);
          }
      }
  }, [requisition.job_description, editor]);

  useEffect(() => {
      if (editor) {
          editor.setEditable(isEditMode);
      }
  }, [isEditMode, editor]);


  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2}}>
      <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
        Job Description
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom sx={{ mb: 2 }}>
        {isEditMode ? 'Create a compelling job description that will be displayed to candidates' : ''}
      </Typography>

      <Box sx={{ 
          border: isEditMode ? '1px solid' : 'none', 
          borderColor: 'divider', 
          borderRadius: 1,
          minHeight: 200,
          '& .ProseMirror': {
              outline: 'none',
              p: isEditMode ? 2 : 0,
          },
          '& ul': {
              listStyleType: 'disc',
              pl: 2
          },
          '& ol': {
              listStyleType: 'decimal',
              pl: 2
          }
      }}>
        {isEditMode && <MenuBar editor={editor} />}
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
};

export default JobDescription;
