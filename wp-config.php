<?php
/**
 * WordPress基础配置文件。
 *
 * 这个文件被安装程序用于自动生成wp-config.php配置文件，
 * 您可以不使用网站，您需要手动复制这个文件，
 * 并重命名为“wp-config.php”，然后填入相关信息。
 *
 * 本文件包含以下配置选项：
 *
 * * MySQL设置
 * * 密钥
 * * 数据库表名前缀
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/zh-cn:%E7%BC%96%E8%BE%91_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL 设置 - 具体信息来自您正在使用的主机 ** //
/** WordPress数据库的名称 */
define('DB_NAME', 'restaurant');

/** MySQL数据库用户名 */
define('DB_USER', 'root');

/** MySQL数据库密码 */
define('DB_PASSWORD', '');

/** MySQL主机 */
define('DB_HOST', 'localhost');

/** 创建数据表时默认的文字编码 */
define('DB_CHARSET', 'utf8mb4');

/** 数据库整理类型。如不确定请勿更改 */
define('DB_COLLATE', '');

/**#@+
 * 身份认证密钥与盐。
 *
 * 修改为任意独一无二的字串！
 * 或者直接访问{@link https://api.wordpress.org/secret-key/1.1/salt/
 * WordPress.org密钥生成服务}
 * 任何修改都会导致所有cookies失效，所有用户将必须重新登录。
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'HUJhwF&Sh@8F`&Aol@9-bSh[D|11>;UwE,@ahJ)whw@;K4Fg&+~HRx[:Hpr6nNsY');
define('SECURE_AUTH_KEY',  'fb{k:g!~F/:V7<U5R7WAai:snLyK<Y88B^osGj.7Al,S7fs4TpqPn?q[yq(uC(M-');
define('LOGGED_IN_KEY',    '3B.@)&S3x%Oo(wlB&a*;;tn~HDb=cweHY=7;Vuty0a9Xy1|,FOL)q<DBe $,M6g/');
define('NONCE_KEY',        'N]0|qL1q8H{*_s8n9O2C8jFj1up3g>KnpaY.^/4>RWqg)t/$1DKw/Qe%N)}Tkl`(');
define('AUTH_SALT',        'U2Q.(BWJjx!s$VL5k<<>3R}l];^M%i8/U^#Xu[pL[tv[/I@]uVa^8I3H!z. H9}M');
define('SECURE_AUTH_SALT', '[5WJ<Q7O|:z@53AhKc31,.@GJIb9E]6drM%6MVs[kFlYaxL {li+_njb%))e*8ZD');
define('LOGGED_IN_SALT',   'C@HpLejQTmftkpr3C$/9WR~3_T?A7)q8xlZe=:sB,hVdL@7<>}Udhc=k)i -3<X%');
define('NONCE_SALT',       'YTr_q@0-v`<x,}F~JmHr#5C_<1;eC{A;P#8#q6QEn#7:lcCFnU7g99}^Rwj[{qd%');

/**#@-*/

/**
 * WordPress数据表前缀。
 *
 * 如果您有在同一数据库内安装多个WordPress的需求，请为每个WordPress设置
 * 不同的数据表前缀。前缀名只能为数字、字母加下划线。
 */
$table_prefix  = 'wp_';

/**
 * 开发者专用：WordPress调试模式。
 *
 * 将这个值改为true，WordPress将显示所有用于开发的提示。
 * 强烈建议插件开发者在开发环境中启用WP_DEBUG。
 *
 * 要获取其他能用于调试的信息，请访问Codex。
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/**
 * zh_CN本地化设置：启用ICP备案号显示
 *
 * 可在设置→常规中修改。
 * 如需禁用，请移除或注释掉本行。
 */
define('WP_ZH_CN_ICP_NUM', true);

/* 好了！请不要再继续编辑。请保存本文件。使用愉快！ */

/** WordPress目录的绝对路径。 */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** 设置WordPress变量和包含文件。 */
require_once(ABSPATH . 'wp-settings.php');
