import axios from 'axios';
import type { WorkspacesResponse } from '../types/sidebar-types';

export const WORKSPACE_APIS = (wsId: string) => {
    return {
        MY_WORKSPACES: `${import.meta.env.VITE_BACKEND_API}/workspaces/my`, //(required authentication)
        CREATE_WORKSPACES: `${import.meta.env.VITE_BACKEND_API}/workspaces`, //(required authentication)
        MY_LAST_WORKSPACE: `${import.meta.env.VITE_BACKEND_API}/workspaces/last`, //(required authentication)
        WORKSPACE_BY_ID: `${import.meta.env.VITE_BACKEND_API}/workspaces/${wsId}`,//(required authentication)
        WORKSPACE_UPDATE: `${import.meta.env.VITE_BACKEND_API}/workspaces/${wsId}`,//(required authentication)
        WORKSPACE_DELETE: `${import.meta.env.VITE_BACKEND_API}/workspaces/${wsId}`, //(required authentication)
        MEMBERS_WORKSPACE: `${import.meta.env.VITE_BACKEND_API}/workspaces/${wsId}/members`, //(required authentication)
        LEAVE_WORKSPACE: `${import.meta.env.VITE_BACKEND_API}/workspaces/${wsId}/leave`, //(required authentication)
        WORKSPACE_LOGO_UPDATE: `${import.meta.env.VITE_BACKEND_API}/workspaces/${wsId}/logo` //(required authentication)
    }
};

export const getMyWorkspaces = async (): Promise<WorkspacesResponse> => {
    const accessToken = localStorage.getItem("access_token");
    
    const response = await axios.get(WORKSPACE_APIS('any').MY_WORKSPACES, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    return response.data;
};