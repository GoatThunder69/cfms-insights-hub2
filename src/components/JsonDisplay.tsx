import { cn } from "@/lib/utils";

interface JsonDisplayProps {
  data: unknown;
  className?: string;
}

const JsonDisplay = ({ data, className }: JsonDisplayProps) => {
  const formatJson = (obj: unknown, indent = 0): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    const spaces = "  ".repeat(indent);
    
    if (obj === null) {
      elements.push(
        <span key="null" className="text-muted-foreground">null</span>
      );
      return elements;
    }

    if (typeof obj === "boolean") {
      elements.push(
        <span key="bool" className="text-warning">{obj.toString()}</span>
      );
      return elements;
    }

    if (typeof obj === "number") {
      elements.push(
        <span key="num" className="text-success">{obj}</span>
      );
      return elements;
    }

    if (typeof obj === "string") {
      elements.push(
        <span key="str" className="text-primary">"{obj}"</span>
      );
      return elements;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        elements.push(<span key="empty-arr">[]</span>);
        return elements;
      }
      elements.push(<span key="arr-open">[{"\n"}</span>);
      obj.forEach((item, i) => {
        elements.push(
          <span key={`arr-${i}`}>
            {spaces}  {formatJson(item, indent + 1)}
            {i < obj.length - 1 ? "," : ""}{"\n"}
          </span>
        );
      });
      elements.push(<span key="arr-close">{spaces}]</span>);
      return elements;
    }

    if (typeof obj === "object") {
      const entries = Object.entries(obj);
      if (entries.length === 0) {
        elements.push(<span key="empty-obj">{"{}"}</span>);
        return elements;
      }
      elements.push(<span key="obj-open">{"{"}{"\n"}</span>);
      entries.forEach(([key, value], i) => {
        elements.push(
          <span key={`obj-${key}`}>
            {spaces}  <span className="text-destructive">"{key}"</span>: {formatJson(value, indent + 1)}
            {i < entries.length - 1 ? "," : ""}{"\n"}
          </span>
        );
      });
      elements.push(<span key="obj-close">{spaces}{"}"}</span>);
      return elements;
    }

    return elements;
  };

  return (
    <pre
      className={cn(
        "bg-secondary/50 border border-border rounded-lg p-4 overflow-auto font-mono text-sm leading-relaxed max-h-[500px]",
        className
      )}
    >
      <code className="text-foreground">{formatJson(data)}</code>
    </pre>
  );
};

export default JsonDisplay;
