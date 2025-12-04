import { Box, Typography, Paper, ToggleButton, ToggleButtonGroup, Divider } from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { FormatBold, FormatItalic, FormatUnderlined, FormatListBulleted, FormatListNumbered, Title, Link as LinkIcon, Code } from '@mui/icons-material';
import { Requisition } from '@/interface/requisition';
import { useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { marked } from 'marked';
import TurndownService from 'turndown';

interface JobDescriptionProps {
  requisition: Partial<Requisition>;
  isEditMode?: boolean;
  onContentChange?: (content: string) => void;
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

const JobDescription = ({ requisition, isEditMode = false, onContentChange }: JobDescriptionProps) => {
  const turndownService = useMemo(() => new TurndownService(), []);

  // Convert initial Markdown to HTML for Tiptap
  const initialContent = useMemo(() => {
    return requisition.content ? marked.parse(requisition.content) : '<p>No job description available.</p>';
  }, [requisition.content]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
          openOnClick: false,
      }),
    ],
    immediatelyRender: false,
    content: initialContent as string, // marked.parse returns string | Promise<string>
    editable: isEditMode,
    onUpdate: ({ editor }) => {
      // Convert HTML back to Markdown
      const markdown = turndownService.turndown(editor.getHTML());
      onContentChange?.(markdown);
    },
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px]',
        },
    },
  });

  // Update content if requisition changes (e.g. after fetch)
  useEffect(() => {
      if (editor && requisition.content) {
          const htmlContent = marked.parse(requisition.content) as string;
          // Only set content if it's different to avoid cursor jumps
          // Note: This is a rough check because HTML <-> MD conversion might not be stable
          // But it helps when switching records
          if (editor.getHTML() !== htmlContent && !editor.isFocused) {
             editor.commands.setContent(htmlContent);
          }
      }
  }, [requisition.content, editor]);

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
          // Styles for view mode (ReactMarkdown) and edit mode (Tiptap)
          '& .prose': {
             maxWidth: 'none',
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
        {isEditMode ? (
          <>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </>
        ) : (
          <Box className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none" sx={{ p: 0 }}>
             <ReactMarkdown>{requisition.content || 'No job description available.'}</ReactMarkdown>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default JobDescription;
