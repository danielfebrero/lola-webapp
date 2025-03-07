import { useTranslation } from "react-i18next";
import { useEffect, useState, useCallback } from "react";
import Meta from "../../components/Meta";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import useGA from "../../hooks/useGA";
import ImageSlider from "../../components/ImageSlider";
import { FixedSizeGrid } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  resetExploreImages,
  appendExploreImages,
  setExploreImagesLoading,
} from "../../store/features/app/appSlice";
import useAPI from "../../hooks/useAPI";

// Grid configuration
const COLUMN_WIDTH = 120; // Fixed width of each image
const ROW_HEIGHT = 120; // Fixed height of each image
// Fix TypeScript error with Grid as JSX component
const Grid = FixedSizeGrid as unknown as React.ComponentType<any>;
const ILoader = InfiniteLoader as unknown as React.ComponentType<any>;

// Tailwind breakpoints for responsive column counts
const breakpoints = {
  sm: 640, // Tailwind's sm breakpoint (small screens)
  md: 768, // Tailwind's md breakpoint (medium screens)
};

const ExploreImagesPage: React.FC = () => {
  const { t } = useTranslation();
  const [imageViewingUrl, setImageViewingUrl] = useState<string | null>(null);
  const { explore, mode } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const { getExploreImages } = useAPI();
  const { sendEvent } = useGA();

  // Pagination state
  const [nextItem, setNextItem] = useState<string | undefined>();
  const [hasNextPage, setHasNextPage] = useState(true);

  // Responsive column count state
  const [columnCount, setColumnCount] = useState(5); // Default to 5 columns

  // Function to update column count based on screen size using Tailwind breakpoints
  const updateColumnCount = useCallback(() => {
    const width = window.innerWidth;
    if (width < breakpoints.sm) {
      setColumnCount(2); // 2 columns on small screens (< 640px)
    } else if (width < breakpoints.md) {
      setColumnCount(3); // 3 columns on medium screens (640px - 767px)
    } else {
      setColumnCount(5); // 5 columns on large screens (≥ 768px)
    }
  }, []);

  // Function to load more images
  const loadMoreItems = useCallback(async () => {
    if (!hasNextPage) return;

    dispatch(setExploreImagesLoading(true));
    try {
      const response = await getExploreImages(nextItem);
      const newImages = response.items; // Array of image objects
      const newNextItem = response.nextItem; // Next cursor or null

      dispatch(appendExploreImages({ images: newImages }));
      setNextItem(newNextItem);
      setHasNextPage(!!newNextItem); // False if no more items
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      dispatch(setExploreImagesLoading(false));
    }
  }, [nextItem, hasNextPage]);

  // Set initial column count and listen for resize events
  useEffect(() => {
    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, [updateColumnCount]);

  // Load the initial set of images on mount
  useEffect(() => {
    dispatch(resetExploreImages());
    setHasNextPage(true);
    setNextItem(undefined);
  }, [mode]); // Added dependencies

  // Check if a row is loaded
  const isRowLoaded = (index: number) =>
    index < Math.ceil(explore.images.items.length / columnCount);

  // Render individual grid cells
  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= explore.images.items.length) return null;

    const image = explore.images.items[index];
    return (
      <div style={style} className="p-1">
        <div
          className="w-full h-full cursor-pointer"
          onClick={() => {
            setImageViewingUrl(image.original);
            sendEvent("clicked_on_image", "explore_images");
          }}
        >
          <img src={image.large} className="w-full h-full object-cover" />
        </div>
      </div>
    );
  };

  return (
    <>
      <Meta title={t("Images")} />
      <ImageSlider
        images={explore.images.items ?? []}
        imageViewingUrl={imageViewingUrl}
        hide={() => setImageViewingUrl(null)}
      />
      <div className="grow pt-2.5 pb-2.5 flex flex-row justify-center w-full no-scrollbar">
        <div
          className="flex flex-col h-[calc(100vh-90px)]"
          style={{ width: `${columnCount * COLUMN_WIDTH}px`, maxWidth: "100%" }}
        >
          <AutoSizer>
            {({ height, width }) => {
              const rowCount = Math.ceil(
                explore.images.items.length / columnCount
              );
              const totalRowCount = rowCount + (hasNextPage ? 1 : 0);
              return (
                <div style={{ width: `${columnCount * COLUMN_WIDTH}px` }}>
                  <ILoader
                    isItemLoaded={isRowLoaded}
                    itemCount={totalRowCount}
                    loadMoreItems={loadMoreItems}
                  >
                    {({
                      onItemsRendered,
                      ref,
                    }: {
                      onItemsRendered: any;
                      ref: any;
                    }) => {
                      // Adapt grid's onItemsRendered to InfiniteLoader's expected format
                      const adaptedOnItemsRendered = (gridProps: any) => {
                        const { visibleRowStartIndex, visibleRowStopIndex } =
                          gridProps;
                        onItemsRendered({
                          visibleStartIndex: visibleRowStartIndex,
                          visibleStopIndex: visibleRowStopIndex,
                        });
                      };
                      return (
                        <Grid
                          className="no-scrollbar"
                          columnCount={columnCount}
                          columnWidth={COLUMN_WIDTH}
                          height={height}
                          rowCount={totalRowCount}
                          rowHeight={ROW_HEIGHT}
                          width={width}
                          onItemsRendered={adaptedOnItemsRendered}
                          ref={ref}
                        >
                          {Cell}
                        </Grid>
                      );
                    }}
                  </ILoader>
                </div>
              );
            }}
          </AutoSizer>
        </div>
      </div>
    </>
  );
};

export default ExploreImagesPage;
