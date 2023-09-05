import { useCallback, useEffect, useRef, useState } from "react";

interface Props<T> {
  results?: T[];
  renderItem(item: T): JSX.Element;
  onChange?: React.ChangeEventHandler;
  onSelect?: (item: T) => void;
  value?: string;
  placeHolder?: string;
  isFocused?: boolean;
  onFinishSearch?: () => void;
  onClick?: React.UIEventHandler;
}

const DarwinDropDownSearch = <T extends object>({
  results = [],
  renderItem,
  value,
  onChange,
  onSelect,
  placeHolder,
  isFocused,
  onFinishSearch,
  onClick
}: Props<T>): JSX.Element => {
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const resultContainer = useRef<HTMLDivElement>(null);
    const [showResults, setShowResults] = useState(false);
    const [defaultValue, setDefaultValue] = useState("");
    const htmlElRef = useRef<HTMLInputElement | null>(null);

    const handleSelection = (selectedIndex: number) => {
        const selectedItem = results[selectedIndex];
        if (!selectedItem) return resetSearchComplete();
        onSelect && onSelect(selectedItem);
        resetSearchComplete();
    };

    const resetSearchComplete = useCallback(() => {
        setFocusedIndex(-1);
        setShowResults(false);
        setDefaultValue("");
    }, []);

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const { key } = e;
    let nextIndexCount = 0;

    // move down
    if (key === "ArrowDown") {
      e.preventDefault();
      nextIndexCount = (focusedIndex + 1) % results.length;
    }

    // move up
    if (key === "ArrowUp") {
      nextIndexCount = (focusedIndex + results.length - 1) % results.length;
    }

    // hide search results
    if (key === "Escape") {
      resetSearchComplete();
    }

    // select the current item
    if (key === "Enter") {
      handleSelection(focusedIndex);
    }

    if(key === "Enter" && e.ctrlKey) {
      onFinishSearch && onFinishSearch();
    }

    setFocusedIndex(nextIndexCount);
  };

  type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
  const handleChange: changeHandler = (e) => {
      setDefaultValue(e.target.value);
      onChange && onChange(e);
  };

  type clickHandler = React.UIEventHandler<HTMLInputElement>;
  const handleClick: clickHandler = (e) => {
    onClick && onClick(e);
  }

  const highlightInput = useCallback((highlight: boolean) => {
    if (highlight && htmlElRef.current) {
      htmlElRef.current.style.borderColor = 'coral';
      htmlElRef.current.style.borderWidth = '2px';
    }
    if (!highlight && htmlElRef.current) {
      htmlElRef.current.style.borderColor = '';
      htmlElRef.current.style.borderWidth = '';

    }
  },[htmlElRef]);

  const handleMouseOver = useCallback((index: number) => {
    setFocusedIndex(index);
  },[]);

  useEffect(() => {
      if (results.length > 0 && !showResults) {
          setShowResults(true);
      }
      if (results.length <= 0) {
          setShowResults(false);
      }
  }, [results, showResults]);

  useEffect(() => {
      if (value) setDefaultValue(value);
  }, [value]);

  useEffect(() => {
      if (isFocused) {
          htmlElRef.current?.focus();
      }
  },[htmlElRef, isFocused]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div
        tabIndex={1}
        onBlur={resetSearchComplete}
        onKeyDown={handleKeyDown}
        onMouseUp={() => handleSelection(focusedIndex)}
        className="relative"
      >
        <input
          value={defaultValue}
          onChange={handleChange}
          type="text"
          className="form-control"
          placeholder={placeHolder}
          ref={htmlElRef}
          onFocus={() => highlightInput(true)}
          onBlur={() => highlightInput(false)}
          onClick={handleClick}
        />
        {/* Search Results Container */}
        {showResults && (
          <div className="absolute mt-1 w-full p-1 pb-0 bg-white shadow-lg rounded-bl rounded-br max-h-24 overflow-y-auto">
            {results.map((item, index) => {
              return (
                <div
                  key={index}
                  onMouseDown={() => handleSelection(index)}
                  onMouseOverCapture={() => handleMouseOver(index)}
                  ref={index === focusedIndex ? resultContainer : null}
                  style={{
                    backgroundColor:
                      index === focusedIndex ? "rgba(0,0,0,0.1)" : "",
                  }}
                  className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-1"
                >
                  {renderItem(item)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DarwinDropDownSearch;