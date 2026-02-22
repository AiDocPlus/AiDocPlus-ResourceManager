#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use aidocplus_manager_rust::commands::DataDirState;

fn main() {
    let data_dir_state = DataDirState::new();

    let args: Vec<String> = std::env::args().collect();
    for i in 0..args.len() {
        if args[i] == "--data-dir" {
            if let Some(dir) = args.get(i + 1) {
                data_dir_state.set(dir.clone());
            }
        }
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .manage(data_dir_state)
        .invoke_handler(aidocplus_manager_rust::commands::get_command_handlers())
        .run(tauri::generate_context!())
        .expect("文档模板管理器启动失败");
}
