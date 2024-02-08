import React, { useEffect, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DraggableComponent = ({ name }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "component",
    item: { type: "component", name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "5px",
      }}
    >
      {name}
    </div>
  );
};

const CanvasArea = ({ components, onMoveComponent }) => {
  const [, drop] = useDrop({
    accept: "component",
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(monitor.getClientOffset().x - delta.x);
      const top = Math.round(monitor.getClientOffset().y - delta.y);
      onMoveComponent(item.name, left, top);
    },
  });

  return (
    <div
      ref={drop}
      style={{
        width: "500px",
        height: "500px",
        border: "1px solid #ccc",
        position: "relative",
      }}
    >
      {components.map((component) => (
        <div
          key={component.name}
          style={{
            position: "absolute",
            left: component.left,
            top: component.top,
            cursor: "move",
          }}
        >
          {component.name === "Date Input" && <input type="date" />}
          {component.name === "Text Input" && <input type="text" />}
          {component.name === "Select Dropdown" && <select></select>}
          {component.name === "Radio Buttons" && <input type="radio" />}

          {component.name === "textarea" && (
            <textarea rows="4" cols="50"></textarea>
          )}
          {component.name === "paragraph" && <input type="text" />}
        </div>
      ))}
    </div>
  );
};

const FormBuilder = () => {
  const [formLabel, setFormLabel] = useState("");
  const [components, setComponents] = useState([]);
  const [form, setForm] = useState(null);
  const [formList, setFormList] = useState([]);

  const handleMoveComponent = (name, left, top) => {
    setComponents((prevState) => prevState.concat({ name, left, top }));
  };

  const handleSaveForm = () => {
    const formData = {
      name: formLabel,
    };

    const formComponents = {
      components: components,
    };

    setForm(formData);
    setFormList((prev) => [...prev, formData]);
    console.log(JSON.stringify(formData));
  };

  useEffect(() => {
    async function getForms() {
      try {
        const res = await fetch("http://localhost:8000/api/getforms");
        if (!res.ok) {
          throw new Error("something wrong");
        }
        const data = await res.json();

        setFormList(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getForms();
  }, []);

  // add using laravel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/addform", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [form]);

  return (
    <div>
      <h1>Form Builder</h1>
      <div>
        <label htmlFor="formLabel">Form Name:</label>
        <input
          type="text"
          id="formLabel"
          value={formLabel}
          onChange={(e) => setFormLabel(e.target.value)}
        />
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "20px" }}>
          <h2>Available Components</h2>
          <DraggableComponent name="Date Input" key={Math.random()} />
          <DraggableComponent name="Text Input" />
          <DraggableComponent name="Select Dropdown" />
          <DraggableComponent name="Radio Buttons" />

          <DraggableComponent name="Text Area" />
          <DraggableComponent name="Paragraph" />
        </div>
        <div>
          <h2>Canvas Area</h2>
          <CanvasArea
            components={components}
            onMoveComponent={handleMoveComponent}
          />
          <button onClick={handleSaveForm}>Save Form</button>
        </div>
      </div>
    </div>
  );
};

const AppWithDndProvider = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <FormBuilder />
    </DndProvider>
  );
};

export default AppWithDndProvider;
