
<ul class="notification_ul">
  <li class="notification_li" id="friend_request">
    <span class="notification_count"><?php echo $total_friend_request; ?></span>
    <a href="#" class="notificationLink">Friend Request</a>

    <div class="notificationContainer">
    <div class="notificationTitle">Friend Request</div>
    <div class="notificationsBody" class="friendquest"></div>
    <div class="notificationFooter"><a href="#">See All</a></div>
    </div>
  </li>
  <li class="notification_li" id="notifications">
    <span class="notification_count"><?php echo $total_notifications; ?></span>
    <a href="#" class="notificationLink">Notifications</a>

    <div class="notificationContainer">
    <div class="notificationTitle">Notifications</div>
    <div class="notificationsBody" class="notifications"></div>
    <div class="notificationFooter"><a href="#">See All</a></div>
    </div>
  </li>
</ul>