#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use aidocplus_manager_rust::commands::DataDirState;

fn main() {
    let data_dir_state = DataDirState::new();
    let mut resource_type = String::new();

    // 解析命令行参数
    let args: Vec<String> = std::env::args().collect();
    let mut i = 1;
    while i < args.len() {
        match args[i].as_str() {
            "--data-dir" => {
                if let Some(dir) = args.get(i + 1) {
                    data_dir_state.set(dir.clone());
                    i += 1;
                }
            }
            "--resource-type" => {
                if let Some(rt) = args.get(i + 1) {
                    resource_type = rt.clone();
                    i += 1;
                }
            }
            _ => {}
        }
        i += 1;
    }

    // 将 resource_type 存入 Tauri state，前端通过命令获取
    let resource_type_state = ResourceTypeState(std::sync::Mutex::new(resource_type));

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .manage(data_dir_state)
        .manage(resource_type_state)
        .invoke_handler(tauri::generate_handler![
            cmd_get_resource_type,
            // 复用所有管理器命令
            aidocplus_manager_rust::commands::cmd_get_data_dir,
            aidocplus_manager_rust::commands::cmd_scan_resources,
            aidocplus_manager_rust::commands::cmd_read_manifest,
            aidocplus_manager_rust::commands::cmd_save_manifest,
            aidocplus_manager_rust::commands::cmd_create_resource,
            aidocplus_manager_rust::commands::cmd_delete_resource,
            aidocplus_manager_rust::commands::cmd_batch_delete_resources,
            aidocplus_manager_rust::commands::cmd_reorder_resources,
            aidocplus_manager_rust::commands::cmd_reindex_all_orders,
            aidocplus_manager_rust::commands::cmd_read_content_file,
            aidocplus_manager_rust::commands::cmd_save_content_file,
            aidocplus_manager_rust::commands::cmd_read_meta,
            aidocplus_manager_rust::commands::cmd_save_meta,
            aidocplus_manager_rust::commands::cmd_export_resources,
            aidocplus_manager_rust::commands::cmd_import_resources,
            aidocplus_manager_rust::commands::cmd_batch_set_enabled,
            aidocplus_manager_rust::commands::cmd_batch_move_category,
            aidocplus_manager_rust::commands::cmd_ai_generate,
            aidocplus_manager_rust::commands::cmd_ai_generate_stream,
            aidocplus_manager_rust::commands::cmd_run_build_script,
            aidocplus_manager_rust::commands::cmd_load_ai_config,
            aidocplus_manager_rust::commands::cmd_save_ai_config,
            aidocplus_manager_rust::commands::cmd_load_shared_ai_services,
            aidocplus_manager_rust::commands::cmd_load_local_ai_services,
            aidocplus_manager_rust::commands::cmd_save_local_ai_services,
            aidocplus_manager_rust::commands::cmd_scan_json_resources,
            aidocplus_manager_rust::commands::cmd_read_json_categories,
            aidocplus_manager_rust::commands::cmd_read_json_template,
            aidocplus_manager_rust::commands::cmd_save_json_template,
            aidocplus_manager_rust::commands::cmd_create_json_template,
            aidocplus_manager_rust::commands::cmd_delete_json_template,
            aidocplus_manager_rust::commands::cmd_batch_delete_json_templates,
            aidocplus_manager_rust::commands::cmd_move_json_template,
            aidocplus_manager_rust::commands::cmd_save_json_category,
        ])
        .run(tauri::generate_context!())
        .expect("资源管理器启动失败");
}

pub struct ResourceTypeState(std::sync::Mutex<String>);

#[tauri::command]
fn cmd_get_resource_type(state: tauri::State<'_, ResourceTypeState>) -> Result<String, String> {
    Ok(state.0.lock().map_err(|e| e.to_string())?.clone())
}
