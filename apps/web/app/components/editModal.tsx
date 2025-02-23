// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import dynamic from "next/dynamic";
// import 'react-quill-new/dist/quill.snow.css';
// import axios from "axios";

// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// interface EditNoteModalProps {
//   noteId: string;
//   closeModal: () => void; 
//   onNoteUpdate: (updatedNote: Note) => void;
// }

// interface Note {
//   _id: string;
//   title: string;
//   content: string;
//   tags: string[];
// }

// const EditNoteModal: React.FC<EditNoteModalProps> = ({ noteId, closeModal, onNoteUpdate }) => {
//   const [note, setNote] = useState<Note | null>(null);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [tags, setTags] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchNote = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(`http://localhost:3001/notes/${noteId}`, {
//           headers: {
//             Authorization: token,
//           },
//         });

//         if (response.status === 200) {
//           const noteData = response.data.note;
//           setNote(noteData);
//           setTitle(noteData.title);
//           setContent(noteData.content);
//           setTags(noteData.tags);
//         } else {
//           console.error("Error fetching note:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching note:", error);
//       }
//     };

//     fetchNote();
//   }, [noteId]);

//   const handleTagChange = (index: number, value: string) => {
//     const newTags = [...tags];
//     newTags[index] = value;
//     setTags(newTags);
//   };

//   const handleAddTag = () => {
//     setTags([...tags, ""]);
//   };

//   const handleRemoveTag = (index: number) => {
//     setTags(tags.filter((_, i) => i !== index));
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const updatedNote = {
//         title,
//         content,
//         tags,
//       };

//       const response = await axios.put(`http://localhost:3001/notes/${noteId}`, updatedNote, {
//         headers: {
//           Authorization: token,
//         },
//       });

//       if (response.status === 200) {
//         onNoteUpdate({ _id: noteId, title, content, tags });
//         closeModal(); 
//       } else {
//         console.error("Error updating note:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error updating note:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!note) {
//     return <div>Loading...</div>; 
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-lg w-full">
//         <h2 className="text-xl font-semibold mb-4">Edit Note</h2>

//         <div className="mb-4">
//           <label htmlFor="title" className="block font-medium mb-1">Title</label>
//           <Input
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter note title"
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="content" className="block font-medium mb-1">Content</label>
//           <ReactQuill
//             id="content"
//             value={content}
//             onChange={setContent}
//             placeholder="Enter note content"
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="tags" className="block font-medium mb-1">Tags</label>
//           {tags.map((tag, index) => (
//             <div key={index} className="flex items-center mb-2">
//               <Input
//                 value={tag}
//                 onChange={(e) => handleTagChange(index, e.target.value)}
//                 placeholder={`Tag ${index + 1}`}
//               />
//               <Button variant="outline" onClick={() => handleRemoveTag(index)} className="ml-2">
//                 Remove
//               </Button>
//             </div>
//           ))}
//           <Button variant="outline" onClick={handleAddTag} className="mt-2">
//             Add Tag
//           </Button>
//         </div>

//         <div className="flex justify-end space-x-2">
//           <Button variant="outline" onClick={closeModal}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave} disabled={loading}>
//             {loading ? "Saving..." : "Save"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditNoteModal;


import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import 'react-quill-new/dist/quill.snow.css';
import axios from "axios";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface EditNoteModalProps {
  noteId: string;
  closeModal: () => void; 
  onNoteUpdate: (updatedNote: Note) => void;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ noteId, closeModal, onNoteUpdate }) => {
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3001/notes/${noteId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 200) {
          const noteData = response.data.note;
          setNote(noteData);
          setTitle(noteData.title);
          setContent(noteData.content);
          setTags(noteData.tags);
        } else {
          console.error("Error fetching note:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    fetchNote();
  }, [noteId]);

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleAddTag = () => {
    setTags([...tags, ""]);
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const updatedNote = {
        title,
        content,
        tags,
      };

      const response = await axios.put(`http://localhost:3001/notes/${noteId}`, updatedNote, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        onNoteUpdate({ _id: noteId, title, content, tags });
        closeModal(); 
      } else {
        console.error("Error updating note:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!note) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">Edit Note</h2>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="mb-4">
            <label htmlFor="title" className="block font-medium mb-1">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
            />
          </div>

          <div className="mb-4 pb-8">
            <label htmlFor="content" className="block font-medium mb-1">Content</label>
            <ReactQuill
              id="content"
              value={content}
              onChange={setContent}
              placeholder="Enter note content"
              className="h-40"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="tags" className="block font-medium mb-1">Tags</label>
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center mb-2">
                <Input
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  placeholder={`Tag ${index + 1}`}
                />
                <Button variant="outline" onClick={() => handleRemoveTag(index)} className="ml-2">
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddTag} className="mt-2">
              Add Tag
            </Button>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModal;
