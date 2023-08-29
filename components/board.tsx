"use client";
import { useBoardStore } from "@/store/boardstore";
import React, { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Columns from "./column";
import { Column } from "@/types";
function Board() {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );
  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    //Check if user dragged card outside of board
    if (!destination) return;
    //handle column drag
    if (type == "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearangedColums = new Map(entries);
      setBoardState({
        ...board,
        columns: rearangedColums,
      });
    }
    //handle card drag
    // this step is needed as the indexes are stroed as number 0,1,2 etc.instead of id's with DND library
    const columns = Array.from(board.columns);
    const startColIdx = columns[Number(source.droppableId)];
    const finishColIdx = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIdx[0],
      todos: startColIdx[1].todos,
    };

    const finishCol: Column = {
      id: finishColIdx[0],
      todos: finishColIdx[1].todos,
    };
    if (!startCol || !finishCol) return;
    if (source.index == destination.index && startCol == finishCol) return;
    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id == finishCol.id) {
      //Same column task drag
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
      setBoardState({ ...board, columns: newColumns });
    } else {
      //dragging to another column
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);
      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });
      //update in DB
      updateTodoInDB(todoMoved,finishCol.id)
      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {
              /* rendering all the colums */
              Array.from(board.columns.entries()).map(([id, column], index) => (
                <Columns key={id} id={id} todos={column.todos} index={index} />
              ))
            }
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
