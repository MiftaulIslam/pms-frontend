
interface COLLECTION_API_IDS {
    workspaceId?: string;
    collectionId?: string;
    folderId?: string;
    itemId?: string;
}

// Collection APIs
export const COLLECTION_APIS = (ids:COLLECTION_API_IDS) => {
    return {
        // get all collections for a workspace
        GET_COLLECTIONS: `${import.meta.env.VITE_BACKEND_API}/playground/collections?workspaceId=${ids.workspaceId}`, //(required authentication)
        // get a collection with hierarchy
        GET_COLLECTION_WITH_HIERARCHY: `${import.meta.env.VITE_BACKEND_API}/playground/collections/${ids.collectionId}`, //(required authentication)
        // 
        // get a collection by id
        GET_COLLECTION_BY_ID: `${import.meta.env.VITE_BACKEND_API}/playground/collections/${ids.collectionId}`, //(required authentication)
        // create a collection
        CREATE_COLLECTION: `${import.meta.env.VITE_BACKEND_API}/playground/collections`, //(required authentication)
        // update a collection
        UPDATE_COLLECTION: `${import.meta.env.VITE_BACKEND_API}/playground/collections/${ids.collectionId}`, //(required authentication)
        // delete a collection
        DELETE_COLLECTION: `${import.meta.env.VITE_BACKEND_API}/playground/collections/${ids.collectionId}`, //(required authentication)
        // --------> Collection Icons APIs <--------
        // upload a collection icon
        UPLOAD_COLLECTION_ICON: `${import.meta.env.VITE_BACKEND_API}/playground/collections/${ids.collectionId}/icon`, //(required authentication)
        // reorder a collection
        REORDER_COLLECTION: `${import.meta.env.VITE_BACKEND_API}/playground/collections/${ids.collectionId}/reorder`, //(required authentication)

        // --------> Folder APIs <--------
        // get a folder by id with children and items
        GET_FOLDER_BY_ID: `${import.meta.env.VITE_BACKEND_API}/playground/folders/${ids.folderId}`, //(required authentication)
        // create a folder
        CREATE_FOLDER: `${import.meta.env.VITE_BACKEND_API}/playground/folders`, //(required authentication)
        // update a folder
        UPDATE_FOLDER: `${import.meta.env.VITE_BACKEND_API}/playground/folders/${ids.folderId}`, //(required authentication)
        // delete a folder
        DELETE_FOLDER: `${import.meta.env.VITE_BACKEND_API}/playground/folders/${ids.folderId}`, //(required authentication)
        // --------> Folder Icons APIs <--------
        // upload a folder icon
        UPLOAD_FOLDER_ICON: `${import.meta.env.VITE_BACKEND_API}/playground/folders/${ids.folderId}/icon`, //(required authentication)
        // reorder a folder
        REORDER_FOLDER: `${import.meta.env.VITE_BACKEND_API}/playground/folders/${ids.folderId}/reorder`, //(required authentication)
        // move a folder
        MOVE_FOLDER: `${import.meta.env.VITE_BACKEND_API}/playground/folders/${ids.folderId}/move`, //(required authentication)
        
        // --------> Item APIs <--------
        // get an item by id with content (kanban board, document, or whiteboard)
        GET_ITEM_BY_ID: `${import.meta.env.VITE_BACKEND_API}/playground/items/${ids.itemId}`, //(required authentication)
        // create an item
        CREATE_ITEM: `${import.meta.env.VITE_BACKEND_API}/playground/items`, //(required authentication)
        // update an item
        UPDATE_ITEM: `${import.meta.env.VITE_BACKEND_API}/playground/items/${ids.itemId}`, //(required authentication)
        // delete an item
        DELETE_ITEM: `${import.meta.env.VITE_BACKEND_API}/playground/items/${ids.itemId}`, //(required authentication)
        
        // --------> Item Icons APIs <--------
        // upload an item icon
        UPLOAD_ITEM_ICON: `${import.meta.env.VITE_BACKEND_API}/playground/items/${ids.itemId}/icon`, //(required authentication)
        // reorder an item
        REORDER_ITEM: `${import.meta.env.VITE_BACKEND_API}/playground/items/${ids.itemId}/reorder`, //(required authentication)
        // move an item
        MOVE_ITEM: `${import.meta.env.VITE_BACKEND_API}/playground/items/${ids.itemId}/move`, //(required authentication)
        
        // --------> Kanban APIs <--------
        // get kanban board by itemId
        GET_KANBAN_BOARD: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/boards/${ids.itemId}`, //(required authentication)
        // create a kanban column
        CREATE_KANBAN_COLUMN: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/columns`, //(required authentication)
        // update a kanban column
        UPDATE_KANBAN_COLUMN: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/columns/${ids.itemId}`, //(required authentication) - uses itemId placeholder for columnId
        // reorder a kanban column
        REORDER_KANBAN_COLUMN: `${import.meta.env.VITE_BACKEND_API}/playground/kanban/columns/${ids.itemId}/reorder`, //(required authentication) - uses itemId placeholder for columnId
        
        // --------> Duplicate APIs <--------
        // duplicate a collection
        DUPLICATE_COLLECTION: `${import.meta.env.VITE_BACKEND_API}/playground/collections/${ids.collectionId}/duplicate`, //(required authentication)
        // duplicate a folder
        DUPLICATE_FOLDER: `${import.meta.env.VITE_BACKEND_API}/playground/folders/${ids.folderId}/duplicate`, //(required authentication)
        // duplicate an item
        DUPLICATE_ITEM: `${import.meta.env.VITE_BACKEND_API}/playground/items/${ids.itemId}/duplicate`, //(required authentication)
    }
};